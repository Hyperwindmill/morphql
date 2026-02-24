import * as vscode from "vscode";
import { compile } from "@morphql/core";

export class MorphQLLivePanel {
  private static instance: MorphQLLivePanel | undefined;

  private panel: vscode.WebviewPanel;
  private sourceData: string = "{}";
  private debounceTimer: NodeJS.Timeout | undefined;
  private disposables: vscode.Disposable[] = [];

  static createOrShow(): void {
    if (MorphQLLivePanel.instance) {
      MorphQLLivePanel.instance.panel.reveal(vscode.ViewColumn.Beside);
      MorphQLLivePanel.instance.triggerUpdate();
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "morphqlLivePanel",
      "MorphQL Live",
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      { enableScripts: true, retainContextWhenHidden: true },
    );

    MorphQLLivePanel.instance = new MorphQLLivePanel(panel);
  }

  private constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
    this.panel.webview.html = this.getWebviewContent();

    // Messages from WebView (source data changes)
    this.panel.webview.onDidReceiveMessage(
      (msg) => {
        if (msg.type === "sourceDataChanged") {
          this.sourceData = msg.sourceData;
          this.triggerUpdate();
        }
      },
      undefined,
      this.disposables,
    );

    // Re-run when switching to a morphql editor
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor?.document.languageId === "morphql") {
          this.triggerUpdate();
        } else if (!editor || editor.document.languageId !== "morphql") {
          this.panel.webview.postMessage({ type: "noQuery" });
        }
      }),
    );

    // Re-run on document edits (debounced)
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        if (
          event.document.languageId === "morphql" &&
          event.document === vscode.window.activeTextEditor?.document
        ) {
          this.scheduleUpdate();
        }
      }),
    );

    // Cleanup
    this.panel.onDidDispose(
      () => {
        MorphQLLivePanel.instance = undefined;
        this.disposables.forEach((d) => d.dispose());
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
      },
      null,
      this.disposables,
    );

    this.triggerUpdate();
  }

  private scheduleUpdate(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.triggerUpdate(), 400);
  }

  private async triggerUpdate(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== "morphql") {
      this.panel.webview.postMessage({ type: "noQuery" });
      return;
    }

    const query = editor.document.getText();
    const fileName =
      editor.document.fileName.split(/[\\/]/).pop() ?? "query.morphql";

    try {
      const engine = await compile(query, { analyze: true } as any);
      const output = (engine as any)(this.sourceData);
      const result =
        typeof output === "string" ? output : JSON.stringify(output, null, 2);

      this.panel.webview.postMessage({
        type: "update",
        fileName,
        result,
        generatedCode: (engine as any).code ?? "",
        error: null,
        analysis: (engine as any).analysis ?? null,
      });
    } catch (err: any) {
      this.panel.webview.postMessage({
        type: "update",
        fileName,
        result: "",
        generatedCode: "",
        error: err.message ?? String(err),
        analysis: null,
      });
    }
  }

  private getWebviewContent(): string {
    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 12px;
      background: var(--vscode-sideBar-background, var(--vscode-editor-background));
      border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
      flex-shrink: 0;
    }
    .filename {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.75;
      font-family: var(--vscode-editor-font-family, monospace);
    }
    .status {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
      letter-spacing: 0.04em;
    }
    .status-ok   { background: rgba(74,222,128,0.15); color: #4ade80; }
    .status-err  { background: rgba(248,113,113,0.15); color: #f87171; }
    .status-idle { background: var(--vscode-badge-background, #3c3c3c); color: var(--vscode-badge-foreground, #ccc); }

    /* ── Source data section ── */
    .source-section {
      flex-shrink: 0;
      border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
    }
    .source-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 12px;
      background: var(--vscode-sideBar-background, var(--vscode-editor-background));
      cursor: pointer;
      user-select: none;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.6;
    }
    .source-header:hover { opacity: 1; }
    .source-body { padding: 6px 8px 8px; }
    .source-body.hidden { display: none; }

    textarea {
      width: 100%;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border, transparent);
      border-radius: 3px;
      padding: 6px 8px;
      font-family: var(--vscode-editor-font-family, 'Consolas', monospace);
      font-size: 12px;
      resize: vertical;
      min-height: 72px;
      max-height: 220px;
      outline: none;
      line-height: 1.5;
    }
    textarea:focus { border-color: var(--vscode-focusBorder, #007acc); }

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
    <span class="filename" id="filename">No MorphQL file active</span>
    <span class="status status-idle" id="status">Idle</span>
  </div>

  <div class="source-section">
    <div class="source-header" id="source-toggle">
      <span id="source-toggle-label">▶ Source Data</span>
      <span style="opacity:0.45; font-weight:400; text-transform:none; letter-spacing:0; font-size:10px">JSON · XML · CSV</span>
    </div>
    <div class="source-body hidden" id="source-body">
      <textarea id="source-input" placeholder='{"key": "value"}  or  &lt;root&gt;...&lt;/root&gt;' spellcheck="false">{}</textarea>
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
      <pre id="result-output" style="display:none"></pre>
      <div class="error-box" id="result-error" style="display:none">
        <div class="error-label">Compilation / Execution Error</div>
        <div id="result-error-msg"></div>
      </div>
    </div>
    <div class="pane" id="pane-code">
      <pre id="code-output" style="opacity:0.45;font-style:italic">Successful compilation required.</pre>
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

    // ── Source section toggle ──
    let sourceOpen = false;
    document.getElementById('source-toggle').addEventListener('click', () => {
      sourceOpen = !sourceOpen;
      document.getElementById('source-body').classList.toggle('hidden', !sourceOpen);
      document.getElementById('source-toggle-label').textContent =
        (sourceOpen ? '▼' : '▶') + ' Source Data';
    });

    // ── Source data → extension ──
    let sourceDebounce;
    document.getElementById('source-input').addEventListener('input', (e) => {
      clearTimeout(sourceDebounce);
      sourceDebounce = setTimeout(() => {
        vscode.postMessage({ type: 'sourceDataChanged', sourceData: e.target.value });
      }, 350);
    });

    // ── Messages from extension ──
    window.addEventListener('message', ({ data: msg }) => {
      if (msg.type === 'noQuery') {
        document.getElementById('filename').textContent = 'No MorphQL file active';
        setStatus('idle', 'Idle');
        showEmpty();
        document.getElementById('code-output').textContent = '';
        document.getElementById('code-output').style.cssText = 'opacity:0.45;font-style:italic';
        document.getElementById('code-output').textContent = 'Successful compilation required.';
        renderStructure(null);
        return;
      }

      if (msg.type === 'update') {
        document.getElementById('filename').textContent = msg.fileName;

        if (msg.error) {
          setStatus('err', 'Error');
          showError(msg.error);
        } else {
          setStatus('ok', 'OK');
          showOutput(msg.result);
        }

        // Generated JS tab
        const codeEl = document.getElementById('code-output');
        if (msg.generatedCode) {
          codeEl.style.cssText = '';
          codeEl.textContent = msg.generatedCode;
        } else {
          codeEl.style.cssText = 'opacity:0.45;font-style:italic';
          codeEl.textContent = 'Successful compilation required.';
        }

        renderStructure(msg.analysis);
      }
    });

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

    function showOutput(text) {
      document.getElementById('result-empty').style.display = 'none';
      document.getElementById('result-output').style.display = 'block';
      document.getElementById('result-output').textContent = text;
      document.getElementById('result-error').style.display = 'none';
    }

    function showError(msg) {
      document.getElementById('result-empty').style.display = 'none';
      document.getElementById('result-output').style.display = 'none';
      document.getElementById('result-error').style.display = 'block';
      document.getElementById('result-error-msg').textContent = msg;
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
      const openBadge = node.isOpen
        ? '<span class="open-badge">(open)</span>'
        : '';
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
      if (hasItems) {
        children += renderNode(node.items, 'items[]');
      }

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
</body>
</html>`;
  }
}
