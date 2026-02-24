import * as vscode from "vscode";
import * as path from "path";
import { compile } from "@morphql/core";

const SETTINGS_DIR = ".morphql-extension";
const SETTINGS_FILE = "panel-settings.json";

interface PanelSettings {
  // relative-to-workspace morphql path → relative-to-workspace source path
  sourceFiles: Record<string, string>;
}

export class MorphQLLivePanel {
  private static instance: MorphQLLivePanel | undefined;

  private panel: vscode.WebviewPanel;
  private trackedDocument: vscode.TextDocument | undefined;
  private sourceFilePath: string | undefined;
  private sourceWatcher: vscode.FileSystemWatcher | undefined;
  private debounceTimer: NodeJS.Timeout | undefined;
  private disposables: vscode.Disposable[] = [];

  static createOrShow(extensionUri: vscode.Uri): void {
    if (MorphQLLivePanel.instance) {
      MorphQLLivePanel.instance.panel.reveal(vscode.ViewColumn.Beside);
      MorphQLLivePanel.instance.triggerUpdate();
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "morphqlLivePanel",
      "MorphQL Live",
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
      },
    );

    MorphQLLivePanel.instance = new MorphQLLivePanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.panel.webview.html = this.getWebviewContent(
      panel.webview,
      extensionUri,
    );

    // Messages from WebView
    this.panel.webview.onDidReceiveMessage(
      async (msg) => {
        if (msg.type === "selectSourceFile") {
          await this.selectSourceFile();
        } else if (msg.type === "openSourceFile") {
          if (this.sourceFilePath) {
            await vscode.window.showTextDocument(
              vscode.Uri.file(this.sourceFilePath),
              { preview: false, preserveFocus: true },
            );
          }
        }
      },
      undefined,
      this.disposables,
    );

    // Re-run when switching to a different morphql editor
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor?.document.languageId === "morphql") {
          this.trackedDocument = editor.document;
          this.onMorphqlFileChanged();
        }
        // editor === undefined → WebView/output focused: do nothing
        // non-morphql editor  → keep last result visible
      }),
    );

    // Re-run on morphql document edits (debounced)
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        if (
          event.document.languageId === "morphql" &&
          event.document === this.trackedDocument
        ) {
          this.scheduleUpdate();
        }
      }),
    );

    // Re-run when the source file is saved inside VS Code
    this.disposables.push(
      vscode.workspace.onDidSaveTextDocument((document) => {
        if (
          this.sourceFilePath &&
          document.fileName === this.sourceFilePath
        ) {
          this.triggerUpdate();
        }
      }),
    );

    // Cleanup
    this.panel.onDidDispose(
      () => {
        MorphQLLivePanel.instance = undefined;
        this.sourceWatcher?.dispose();
        this.disposables.forEach((d) => d.dispose());
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
      },
      null,
      this.disposables,
    );

    // Seed from whatever is currently active
    const active = vscode.window.activeTextEditor;
    if (active?.document.languageId === "morphql") {
      this.trackedDocument = active.document;
    }

    this.onMorphqlFileChanged();
  }

  // ── Source file management ───────────────────────────────────────────────

  private async onMorphqlFileChanged(): Promise<void> {
    if (!this.trackedDocument) {
      this.panel.webview.postMessage({ type: "noQuery" });
      return;
    }
    this.sourceFilePath = await this.resolveSourceFile(
      this.trackedDocument.fileName,
    );
    this.watchSourceFile();
    this.triggerUpdate();
  }

  private watchSourceFile(): void {
    this.sourceWatcher?.dispose();
    if (!this.sourceFilePath) return;

    this.sourceWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(
        vscode.Uri.file(path.dirname(this.sourceFilePath)),
        path.basename(this.sourceFilePath),
      ),
    );
    this.sourceWatcher.onDidChange(() => this.triggerUpdate());
    this.sourceWatcher.onDidDelete(() => {
      this.sourceFilePath = undefined;
      this.triggerUpdate();
    });
  }

  private async resolveSourceFile(
    morphqlPath: string,
  ): Promise<string | undefined> {
    // 1. Check persisted user choice
    const saved = await this.loadSettings();
    const workspaceRoot = this.getWorkspaceRoot();
    if (saved && workspaceRoot) {
      const relMorphql = path.relative(workspaceRoot, morphqlPath);
      const relSource = saved.sourceFiles[relMorphql];
      if (relSource) {
        return path.join(workspaceRoot, relSource);
      }
    }

    // 2. Auto-detect: file with same basename but different extension
    const dir = path.dirname(morphqlPath);
    const baseName = path.basename(morphqlPath, ".morphql");
    try {
      const entries = await vscode.workspace.fs.readDirectory(
        vscode.Uri.file(dir),
      );
      const match = entries
        .filter(
          ([name, type]) =>
            type === vscode.FileType.File &&
            !name.endsWith(".morphql") &&
            path.basename(name, path.extname(name)) === baseName,
        )
        .sort(([a], [b]) => a.localeCompare(b))
        .at(0);

      if (match) {
        return path.join(dir, match[0]);
      }
    } catch {
      // unreadable directory — ignore
    }

    return undefined;
  }

  private async selectSourceFile(): Promise<void> {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      openLabel: "Use as Source Data",
      title: "Select source data file for MorphQL Live",
    });
    if (!uris || uris.length === 0) return;

    this.sourceFilePath = uris[0].fsPath;
    this.watchSourceFile();

    if (this.trackedDocument) {
      await this.saveSourceFileChoice(
        this.trackedDocument.fileName,
        this.sourceFilePath,
      );
    }

    this.triggerUpdate();
  }

  // ── Settings persistence ─────────────────────────────────────────────────

  private async saveSourceFileChoice(
    morphqlPath: string,
    sourcePath: string,
  ): Promise<void> {
    const workspaceRoot = this.getWorkspaceRoot();
    if (!workspaceRoot) return;

    const settings = (await this.loadSettings()) ?? { sourceFiles: {} };
    settings.sourceFiles[path.relative(workspaceRoot, morphqlPath)] =
      path.relative(workspaceRoot, sourcePath);

    const settingsDir = vscode.Uri.file(
      path.join(workspaceRoot, SETTINGS_DIR),
    );
    const settingsFile = vscode.Uri.file(
      path.join(workspaceRoot, SETTINGS_DIR, SETTINGS_FILE),
    );

    try {
      await vscode.workspace.fs.createDirectory(settingsDir);
      await vscode.workspace.fs.writeFile(
        settingsFile,
        Buffer.from(JSON.stringify(settings, null, 2)),
      );
    } catch {
      // silently ignore write failures
    }
  }

  private async loadSettings(): Promise<PanelSettings | undefined> {
    const workspaceRoot = this.getWorkspaceRoot();
    if (!workspaceRoot) return undefined;

    const settingsFile = vscode.Uri.file(
      path.join(workspaceRoot, SETTINGS_DIR, SETTINGS_FILE),
    );
    try {
      const raw = await vscode.workspace.fs.readFile(settingsFile);
      return JSON.parse(Buffer.from(raw).toString("utf-8")) as PanelSettings;
    } catch {
      return undefined;
    }
  }

  private getWorkspaceRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  // ── Update logic ─────────────────────────────────────────────────────────

  private scheduleUpdate(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.triggerUpdate(), 400);
  }

  private async triggerUpdate(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor?.document.languageId === "morphql") {
      this.trackedDocument = activeEditor.document;
    }

    const doc = this.trackedDocument;
    if (!doc) {
      this.panel.webview.postMessage({ type: "noQuery" });
      return;
    }

    const query = doc.getText();
    const fileName = doc.fileName.split(/[\\/]/).pop() ?? "query.morphql";

    // Read source data from file (fallback to empty object)
    let sourceData = "{}";
    let sourceFileName: string | null = null;

    if (this.sourceFilePath) {
      try {
        const raw = await vscode.workspace.fs.readFile(
          vscode.Uri.file(this.sourceFilePath),
        );
        sourceData = Buffer.from(raw).toString("utf-8");
        sourceFileName = path.basename(this.sourceFilePath);
      } catch {
        sourceFileName = path.basename(this.sourceFilePath) + " (unreadable)";
      }
    }

    try {
      const engine = await compile(query, { analyze: true } as any);
      const output = (engine as any)(sourceData);
      const result =
        typeof output === "string" ? output : JSON.stringify(output, null, 2);

      this.panel.webview.postMessage({
        type: "update",
        fileName,
        sourceFileName,
        result,
        generatedCode: (engine as any).code ?? "",
        error: null,
        analysis: (engine as any).analysis ?? null,
      });
    } catch (err: any) {
      this.panel.webview.postMessage({
        type: "update",
        fileName,
        sourceFileName,
        result: "",
        generatedCode: "",
        error: err.message ?? String(err),
        analysis: null,
      });
    }
  }

  // ── WebView HTML ─────────────────────────────────────────────────────────

  private getWebviewContent(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
  ): string {
    const media = (file: string) =>
      webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", file));

    const prismCss = media("prism-tomorrow.min.css");
    const prismJs = media("prism.js");
    const prismJsLang = media("prism-javascript.js");
    const prismJsonLang = media("prism-json.js");
    const prismMarkupLang = media("prism-markup.js");
    const cspSource = webview.cspSource;

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src ${cspSource} 'unsafe-inline';">
  <link rel="stylesheet" href="${prismCss}">
  <title>MorphQL Live</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-editor-foreground);
      background: var(--vscode-editor-background);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ── Toolbar ── */
    .toolbar {
      flex-shrink: 0;
      background: var(--vscode-sideBar-background, var(--vscode-editor-background));
      border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
    }
    .toolbar-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 12px;
    }
    .toolbar-source {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 12px 5px;
      border-top: 1px solid var(--vscode-panel-border, #3c3c3c);
      opacity: 0.7;
    }
    .toolbar-source:hover { opacity: 1; }

    .filename {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.8;
      font-family: var(--vscode-editor-font-family, monospace);
    }
    .status {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
    .status-ok   { background: rgba(74,222,128,0.15); color: #4ade80; }
    .status-err  { background: rgba(248,113,113,0.15); color: #f87171; }
    .status-idle { background: var(--vscode-badge-background, #3c3c3c); color: var(--vscode-badge-foreground, #ccc); }

    .source-arrow { font-size: 10px; opacity: 0.4; flex-shrink: 0; }
    .source-name {
      font-size: 11px;
      font-family: var(--vscode-editor-font-family, monospace);
      font-weight: 500;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .source-name.none { font-style: italic; opacity: 0.45; }
    .source-btn {
      font-size: 10px;
      padding: 1px 6px;
      border: 1px solid var(--vscode-input-border, #555);
      border-radius: 3px;
      background: none;
      color: var(--vscode-editor-foreground);
      cursor: pointer;
      opacity: 0.55;
      flex-shrink: 0;
    }
    .source-btn:hover { opacity: 1; background: var(--vscode-list-hoverBackground, rgba(255,255,255,0.05)); }

    /* ── Tabs ── */
    .tabs {
      display: flex;
      background: var(--vscode-sideBar-background, var(--vscode-editor-background));
      border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
      flex-shrink: 0;
    }
    .tab {
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--vscode-tab-inactiveForeground, #888);
      background: none;
      letter-spacing: 0.03em;
    }
    .tab:hover { color: var(--vscode-editor-foreground); }
    .tab.active {
      color: var(--vscode-tab-activeForeground, var(--vscode-editor-foreground));
      border-bottom-color: var(--vscode-textLink-foreground, #569cd6);
    }

    /* ── Content ── */
    .content { flex: 1; overflow: auto; position: relative; }
    .pane { display: none; min-height: 100%; }
    .pane.active { display: block; }

    pre {
      margin: 0;
      padding: 12px;
      font-family: var(--vscode-editor-font-family, 'Consolas', monospace);
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Prism overrides — use VS Code background, no text shadows */
    pre[class*="language-"],
    code[class*="language-"] {
      background: transparent !important;
      text-shadow: none !important;
      font-family: var(--vscode-editor-font-family, 'Consolas', monospace) !important;
      font-size: 12px !important;
    }

    .error-box {
      margin: 12px;
      padding: 10px 14px;
      background: rgba(248,113,113,0.07);
      border: 1px solid rgba(248,113,113,0.25);
      border-radius: 4px;
      color: var(--vscode-errorForeground, #f87171);
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 12px;
      line-height: 1.6;
    }
    .error-label {
      font-weight: 700;
      font-size: 10px;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      margin-bottom: 5px;
      opacity: 0.7;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
      opacity: 0.35;
      font-size: 12px;
      font-style: italic;
    }

    /* ── Structure tree ── */
    .tree { padding: 8px 12px; font-family: var(--vscode-editor-font-family, monospace); font-size: 12px; }
    .tree-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.35;
      padding: 10px 0 4px;
    }
    .tree-divider { border-top: 1px solid var(--vscode-panel-border, #3c3c3c); margin: 10px 0; }

    details { padding-left: 14px; }
    summary {
      cursor: pointer;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 2px 0;
      user-select: none;
    }
    summary::-webkit-details-marker { display: none; }
    .chevron { font-size: 9px; opacity: 0.45; display: inline-block; transition: transform 0.1s; width: 10px; }
    details[open] > summary .chevron { transform: rotate(90deg); }
    .leaf-spacer { display: inline-block; width: 10px; }

    .fname { opacity: 0.85; }
    .ftype { font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
    .t-string  { color: #4ade80; }
    .t-number  { color: #fbbf24; }
    .t-boolean { color: #818cf8; }
    .t-array   { color: #f472b6; }
    .t-object  { color: #94a3b8; }
    .t-unknown { color: #64748b; }
    .open-badge { font-size: 9px; color: #818cf8; font-style: italic; margin-left: 3px; opacity: 0.8; }
  </style>
</head>
<body>

  <div class="toolbar">
    <div class="toolbar-main">
      <span class="filename" id="filename">No MorphQL file active</span>
      <span class="status status-idle" id="status">Idle</span>
    </div>
    <div class="toolbar-source">
      <span class="source-arrow">←</span>
      <span class="source-name none" id="source-name">no source file</span>
      <button class="source-btn" id="btn-open-source" title="Open source file in editor" style="display:none">open</button>
      <button class="source-btn" id="btn-change-source">change</button>
    </div>
  </div>

  <div class="tabs">
    <button class="tab active" data-pane="result">Result</button>
    <button class="tab" data-pane="code">Generated JS</button>
    <button class="tab" data-pane="structure">Structure</button>
  </div>

  <div class="content">
    <div class="pane active" id="pane-result">
      <div class="empty-state" id="result-empty">Open a .morphql file to see live output</div>
      <pre id="result-output" style="display:none"><code id="result-code" class="language-plaintext"></code></pre>
      <div class="error-box" id="result-error" style="display:none">
        <div class="error-label">Compilation / Execution Error</div>
        <div id="result-error-msg"></div>
      </div>
    </div>
    <div class="pane" id="pane-code">
      <div class="empty-state" id="code-empty">Successful compilation required.</div>
      <pre id="code-output" style="display:none"><code id="code-code" class="language-javascript"></code></pre>
    </div>
    <div class="pane" id="pane-structure">
      <div class="tree" id="structure-tree">
        <div class="empty-state" style="padding:20px 0">No structure detected</div>
      </div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    // ── Tab switching ──
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('pane-' + tab.dataset.pane).classList.add('active');
      });
    });

    // ── Source file buttons ──
    document.getElementById('btn-open-source').addEventListener('click', () => {
      vscode.postMessage({ type: 'openSourceFile' });
    });
    document.getElementById('btn-change-source').addEventListener('click', () => {
      vscode.postMessage({ type: 'selectSourceFile' });
    });

    // ── Messages from extension ──
    window.addEventListener('message', ({ data: msg }) => {
      if (msg.type === 'noQuery') {
        document.getElementById('filename').textContent = 'No MorphQL file active';
        setStatus('idle', 'Idle');
        setSourceFile(null);
        showEmpty();
        resetCode();
        renderStructure(null);
        return;
      }

      if (msg.type === 'update') {
        document.getElementById('filename').textContent = msg.fileName;
        setSourceFile(msg.sourceFileName);

        if (msg.error) {
          setStatus('err', 'Error');
          showError(msg.error);
        } else {
          setStatus('ok', 'OK');
          showOutput(msg.result);
        }

        if (msg.generatedCode) {
          document.getElementById('code-empty').style.display = 'none';
          document.getElementById('code-output').style.display = 'block';
          const codeInner = document.getElementById('code-code');
          codeInner.textContent = msg.generatedCode;
          Prism.highlightElement(codeInner);
        } else {
          resetCode();
        }

        renderStructure(msg.analysis);
      }
    });

    function setSourceFile(name) {
      const nameEl = document.getElementById('source-name');
      const openBtn = document.getElementById('btn-open-source');
      if (name) {
        nameEl.textContent = name;
        nameEl.classList.remove('none');
        openBtn.style.display = '';
      } else {
        nameEl.textContent = 'no source file';
        nameEl.classList.add('none');
        openBtn.style.display = 'none';
      }
    }

    function setStatus(cls, text) {
      const el = document.getElementById('status');
      el.className = 'status status-' + cls;
      el.textContent = text;
    }

    function showEmpty() {
      document.getElementById('result-empty').style.display = 'flex';
      document.getElementById('result-output').style.display = 'none';
      document.getElementById('result-error').style.display = 'none';
    }

    function detectLang(text) {
      const t = text.trim();
      if (t.startsWith('{') || t.startsWith('[')) return 'json';
      if (t.startsWith('<')) return 'markup';
      return 'plaintext';
    }

    function showOutput(text) {
      document.getElementById('result-empty').style.display = 'none';
      document.getElementById('result-output').style.display = 'block';
      document.getElementById('result-error').style.display = 'none';
      const codeEl = document.getElementById('result-code');
      codeEl.textContent = text;
      codeEl.className = 'language-' + detectLang(text);
      Prism.highlightElement(codeEl);
    }

    function showError(msg) {
      document.getElementById('result-empty').style.display = 'none';
      document.getElementById('result-output').style.display = 'none';
      document.getElementById('result-error').style.display = 'block';
      document.getElementById('result-error-msg').textContent = msg;
    }

    function resetCode() {
      document.getElementById('code-empty').style.display = 'flex';
      document.getElementById('code-output').style.display = 'none';
      document.getElementById('code-code').textContent = '';
    }

    // ── Structure tree ──
    function renderStructure(analysis) {
      const container = document.getElementById('structure-tree');
      if (!analysis || (!analysis.source && !analysis.target)) {
        container.innerHTML = '<div class="empty-state" style="padding:20px 0">No structure detected</div>';
        return;
      }
      let html = '';
      if (analysis.source) {
        html += '<div class="tree-label">Input Structure</div>';
        html += renderNode(analysis.source, null);
      }
      if (analysis.source && analysis.target) {
        html += '<div class="tree-divider"></div>';
      }
      if (analysis.target) {
        html += '<div class="tree-label">Output Structure</div>';
        html += renderNode(analysis.target, null);
      }
      container.innerHTML = html;
    }

    function renderNode(node, name) {
      if (!node) return '';
      const hasProps = node.properties && Object.keys(node.properties).length > 0;
      const hasItems = !!node.items;
      const isLeaf = !hasProps && !hasItems;

      const nameHtml = name != null
        ? '<span class="fname">' + esc(name) + ':</span> '
        : '';
      const openBadge = node.isOpen ? '<span class="open-badge">(open)</span>' : '';
      const typeHtml = '<span class="ftype t-' + esc(node.type || 'unknown') + '">'
        + esc(node.type || 'unknown') + openBadge + '</span>';

      if (isLeaf) {
        return '<details class="leaf"><summary>'
          + '<span class="leaf-spacer"></span>'
          + nameHtml + typeHtml
          + '</summary></details>';
      }

      let children = '';
      if (hasProps) {
        for (const [k, v] of Object.entries(node.properties)) {
          children += renderNode(v, k);
        }
      }
      if (hasItems) children += renderNode(node.items, 'items[]');

      return '<details open><summary>'
        + '<span class="chevron">▶</span>'
        + nameHtml + typeHtml
        + '</summary>' + children + '</details>';
    }

    function esc(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  </script>
  <script src="${prismJs}"></script>
  <script src="${prismMarkupLang}"></script>
  <script src="${prismJsonLang}"></script>
  <script src="${prismJsLang}"></script>
</body>
</html>`;
  }
}
