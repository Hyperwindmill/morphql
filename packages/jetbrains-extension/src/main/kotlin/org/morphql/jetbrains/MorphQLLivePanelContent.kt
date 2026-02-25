package org.morphql.jetbrains

import com.google.gson.Gson
import com.google.gson.JsonNull
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.google.gson.JsonPrimitive
import com.intellij.openapi.Disposable
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.editor.colors.EditorColorsManager
import com.intellij.openapi.editor.event.DocumentEvent
import com.intellij.openapi.editor.event.DocumentListener
import com.intellij.openapi.fileChooser.FileChooser
import com.intellij.openapi.fileChooser.FileChooserDescriptor
import com.intellij.openapi.fileEditor.FileDocumentManager
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.fileEditor.FileEditorManagerEvent
import com.intellij.openapi.fileEditor.FileEditorManagerListener
import com.intellij.openapi.fileEditor.TextEditor
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.LocalFileSystem
import com.intellij.openapi.vfs.VfsUtil
import com.intellij.openapi.vfs.VirtualFile
import java.io.File
import java.nio.file.Paths
import com.intellij.openapi.wm.ToolWindow
import com.intellij.ui.JBColor
import com.intellij.ui.jcef.JBCefBrowser
import com.intellij.ui.jcef.JBCefBrowserBase
import com.intellij.ui.jcef.JBCefJSQuery
import com.intellij.util.ui.JBUI
import com.intellij.util.ui.UIUtil
import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.handler.CefLoadHandlerAdapter
import org.cef.network.CefRequest
import java.awt.Color
import java.util.Timer
import java.util.TimerTask
import javax.swing.JComponent

private const val SETTINGS_DIR = ".morphql-extension"
private const val SETTINGS_FILE = "panel-settings.json"

class MorphQLLivePanelContent(
    private val project: Project,
    @Suppress("UNUSED_PARAMETER") toolWindow: ToolWindow,
) : Disposable {

    private val browser = JBCefBrowser()
    val component: JComponent = browser.component

    private val gson = Gson()
    private val jsQuery: JBCefJSQuery
    private val connection = project.messageBus.connect()

    private var currentFile: VirtualFile? = null
    private var sourceFile: VirtualFile? = null
    private var docListener: DocumentListener? = null
    private var debounceTimer: Timer? = null

    init {
        // ── 1. JS query: JS → Kotlin ────────────────────────────────────
        jsQuery = JBCefJSQuery.create(browser as JBCefBrowserBase)
        jsQuery.addHandler { json ->
            handleMessage(json)
            null
        }

        // ── 2. Inject window.__morphqlSend on every page load ───────────
        browser.jbCefClient.addLoadHandler(object : CefLoadHandlerAdapter() {
            override fun onLoadStart(
                b: CefBrowser,
                frame: CefFrame,
                transitionType: CefRequest.TransitionType,
            ) {
                if (frame.isMain) {
                    frame.executeJavaScript(
                        "window.__morphqlSend = function(json) { ${jsQuery.inject("json")} };",
                        frame.url,
                        0,
                    )
                }
            }
        }, browser.cefBrowser)

        // ── 3. Load panel HTML ──────────────────────────────────────────
        browser.loadHTML(buildPanelHtml())

        // ── 4. Listen for editor tab changes ───────────────────────────
        connection.subscribe(
            FileEditorManagerListener.FILE_EDITOR_MANAGER,
            object : FileEditorManagerListener {
                override fun selectionChanged(event: FileEditorManagerEvent) {
                    val newFile = event.newFile
                    if (newFile != null && newFile.extension == "morphql") {
                        setCurrentFile(newFile)
                    }
                    // non-morphql or null → keep last result visible
                }
            },
        )

        // ── 5. Seed from the currently active editor ────────────────────
        val activeFile =
            (FileEditorManager.getInstance(project).selectedEditor as? TextEditor)?.file
        if (activeFile?.extension == "morphql") {
            setCurrentFile(activeFile)
        } else {
            sendNoQuery()
        }
    }

    // ── File tracking ────────────────────────────────────────────────────────

    private fun setCurrentFile(file: VirtualFile) {
        removeDocListener()
        currentFile = file
        sourceFile = resolveSourceFile(file)

        val listener = object : DocumentListener {
            override fun documentChanged(event: DocumentEvent) {
                scheduleUpdate()
            }
        }
        docListener = listener
        FileDocumentManager.getInstance().getDocument(file)?.addDocumentListener(listener)

        triggerUpdate()
    }

    private fun removeDocListener() {
        val listener = docListener ?: return
        val file = currentFile ?: return
        FileDocumentManager.getInstance().getDocument(file)?.removeDocumentListener(listener)
        docListener = null
    }

    private fun resolveSourceFile(morphqlFile: VirtualFile): VirtualFile? {
        val basePath = project.basePath
        if (basePath != null) {
            val relMorphql = toRelative(basePath, morphqlFile.path)
            val relSource = loadSettings()?.get(relMorphql)
            if (relSource != null) {
                val absSource = Paths.get(basePath).resolve(relSource).toString()
                val vf = LocalFileSystem.getInstance().findFileByPath(absSource)
                if (vf != null && vf.exists()) return vf
            }
        }
        return autoDetectSourceFile(morphqlFile)
    }

    private fun autoDetectSourceFile(morphqlFile: VirtualFile): VirtualFile? {
        val dir = morphqlFile.parent ?: return null
        val baseName = morphqlFile.nameWithoutExtension
        return dir.children
            .filter { !it.isDirectory && it.extension != "morphql" && it.nameWithoutExtension == baseName }
            .sortedBy { it.name }
            .firstOrNull()
    }

    // ── Update ───────────────────────────────────────────────────────────────

    private fun scheduleUpdate() {
        debounceTimer?.cancel()
        val timer = Timer("MorphQL-debounce", true)
        debounceTimer = timer
        timer.schedule(
            object : TimerTask() {
                override fun run() = triggerUpdate()
            },
            400L,
        )
    }

    private fun triggerUpdate() {
        val file = currentFile ?: run { sendNoQuery(); return }

        val query = ApplicationManager.getApplication().runReadAction<String> {
            FileDocumentManager.getInstance().getDocument(file)?.text
                ?: VfsUtil.loadText(file)
        }
        val fileName = file.name

        var sourceData = "{}"
        var sourceFileName: String? = null
        sourceFile?.let { sf ->
            try {
                sourceData = VfsUtil.loadText(sf)
                sourceFileName = sf.name
            } catch (_: Exception) {
                sourceFileName = sf.name + " (unreadable)"
            }
        }

        sendData(query, sourceData, fileName, sourceFileName)
    }

    // ── Messaging (Kotlin → JS) ──────────────────────────────────────────────

    private fun sendData(
        query: String,
        sourceData: String,
        fileName: String,
        sourceFileName: String?,
    ) {
        val obj = JsonObject().apply {
            addProperty("type", "data")
            addProperty("query", query)
            addProperty("sourceData", sourceData)
            addProperty("fileName", fileName)
            add(
                "sourceFileName",
                if (sourceFileName != null) JsonPrimitive(sourceFileName) else JsonNull.INSTANCE,
            )
        }
        postToPanel(obj.toString())
    }

    private fun sendNoQuery() {
        postToPanel("""{"type":"noQuery"}""")
    }

    private fun postToPanel(json: String) {
        ApplicationManager.getApplication().invokeLater {
            browser.cefBrowser.mainFrame?.executeJavaScript(
                "window.postMessage($json, '*');",
                browser.cefBrowser.url,
                0,
            )
        }
    }

    // ── Message handling (JS → Kotlin) ───────────────────────────────────────

    private fun handleMessage(json: String) {
        try {
            val type = JsonParser.parseString(json).asJsonObject.get("type")?.asString
            when (type) {
                "openSourceFile" -> ApplicationManager.getApplication().invokeLater {
                    sourceFile?.let { FileEditorManager.getInstance(project).openFile(it, true) }
                }
                "selectSourceFile" -> ApplicationManager.getApplication().invokeLater {
                    selectSourceFile()
                }
            }
        } catch (_: Exception) {
            // ignore malformed messages
        }
    }

    private fun selectSourceFile() {
        val descriptor = FileChooserDescriptor(true, false, false, false, false, false)
            .withTitle("Select Source Data File for MorphQL Live")
        FileChooser.chooseFile(descriptor, project, sourceFile) { file ->
            sourceFile = file
            currentFile?.let { saveSettings(it.path, file.path) }
            triggerUpdate()
        }
    }

    // ── Settings persistence ─────────────────────────────────────────────────
    //
    // Same format as the VSCode extension: .morphql-extension/panel-settings.json
    // with a "sourceFiles" map of relative morphql path → relative source path.
    // This makes the choice cross-IDE compatible.

    private fun loadSettings(): Map<String, String>? {
        val basePath = project.basePath ?: return null
        val file = File(basePath, "$SETTINGS_DIR/$SETTINGS_FILE")
        if (!file.exists()) return null
        return try {
            val obj = JsonParser.parseString(file.readText(Charsets.UTF_8))
                .asJsonObject
                .getAsJsonObject("sourceFiles")
                ?: return null
            obj.entrySet().associate { (k, v) -> k to v.asString }
        } catch (_: Exception) {
            null
        }
    }

    private fun saveSettings(morphqlAbsPath: String, sourceAbsPath: String) {
        val basePath = project.basePath ?: return
        val relMorphql = toRelative(basePath, morphqlAbsPath)
        val relSource = toRelative(basePath, sourceAbsPath)

        val existing = loadSettings()?.toMutableMap() ?: mutableMapOf()
        existing[relMorphql] = relSource

        val sourceFilesObj = JsonObject()
        existing.forEach { (k, v) -> sourceFilesObj.addProperty(k, v) }
        val root = JsonObject().apply { add("sourceFiles", sourceFilesObj) }

        try {
            val dir = File(basePath, SETTINGS_DIR).also { it.mkdirs() }
            File(dir, SETTINGS_FILE).writeText(gson.toJson(root), Charsets.UTF_8)
        } catch (_: Exception) {
            // silently ignore write failures
        }
    }

    /** Returns a forward-slash relative path, matching the VSCode convention. */
    private fun toRelative(base: String, absolute: String): String =
        Paths.get(base).relativize(Paths.get(absolute))
            .toString()
            .replace(File.separatorChar, '/')

    // ── HTML assembly ────────────────────────────────────────────────────────

    private fun buildPanelHtml(): String {
        val template = readResource("/morphql-panel/panel.html")
        val prismCss = readResource("/morphql-panel/prism-tomorrow.min.css")
        val panelJs = readResource("/morphql-panel/panel.iife.js")

        return template
            .replace("<!-- THEME_STYLE -->", "<style>:root {\n${getThemeCss()}\n}</style>")
            .replace(
                "<link rel=\"stylesheet\" href=\"prism-tomorrow.min.css\">",
                "<style>\n$prismCss\n</style>",
            )
            .replace(
                "<script src=\"panel.iife.js\"></script>",
                "<script>\n${panelJs.replace("</script>", "<\\/script>")}\n</script>",
            )
    }

    private fun readResource(path: String): String =
        MorphQLLivePanelContent::class.java.getResourceAsStream(path)
            ?.bufferedReader(Charsets.UTF_8)
            ?.readText()
            ?: error("Panel resource not found: $path")

    // ── Theme CSS (maps IntelliJ theme → VS Code CSS variables) ─────────────

    private fun getThemeCss(): String {
        val scheme = EditorColorsManager.getInstance().globalScheme
        val bg = colorHex(scheme.defaultBackground)
        val fg = colorHex(scheme.defaultForeground)
        val panelBg = colorHex(UIUtil.getPanelBackground())
        val border = colorHex(UIUtil.getBoundsColor())
        val disabledFg = colorHex(UIUtil.getContextHelpForeground())
        val linkFg = colorHex(JBUI.CurrentTheme.Link.Foreground.ENABLED)
        val hoverBg = colorHex(UIUtil.getListSelectionBackground(false))
        val fontName = scheme.editorFontName

        return """
            --vscode-editor-background: $bg;
            --vscode-editor-foreground: $fg;
            --vscode-sideBar-background: $panelBg;
            --vscode-panel-border: $border;
            --vscode-editor-font-family: '$fontName', Consolas, monospace;
            --vscode-font-family: system-ui, -apple-system, sans-serif;
            --vscode-font-size: 13px;
            --vscode-tab-inactiveForeground: $disabledFg;
            --vscode-tab-activeForeground: $fg;
            --vscode-textLink-foreground: $linkFg;
            --vscode-badge-background: $panelBg;
            --vscode-badge-foreground: $fg;
            --vscode-input-border: $border;
            --vscode-list-hoverBackground: $hoverBg;
            --vscode-errorForeground: ${colorHex(JBColor.RED)};
        """.trimIndent()
    }

    private fun colorHex(color: Color?): String =
        if (color == null) "#888888"
        else String.format("#%02x%02x%02x", color.red, color.green, color.blue)

    // ── Dispose ──────────────────────────────────────────────────────────────

    override fun dispose() {
        debounceTimer?.cancel()
        removeDocListener()
        connection.disconnect()
        jsQuery.dispose()
        browser.dispose()
    }
}
