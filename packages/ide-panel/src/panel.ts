import { compile } from "@morphql/core";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup";

// ── Host bridge ───────────────────────────────────────────────────────
//
// VSCode: window.acquireVsCodeApi() is injected by the WebView runtime.
// JetBrains JCEF: host injects window.__morphqlSend(jsonStr) before the
//   panel loads, and dispatches messages via browser.executeJavaScript().
// Fallback (standalone browser / tests): logs to console.

interface HostBridge {
  postMessage(msg: unknown): void;
}

function createBridge(): HostBridge {
  const g = globalThis as Record<string, unknown>;

  if (typeof g["acquireVsCodeApi"] === "function") {
    const vscode = (g["acquireVsCodeApi"] as () => { postMessage(m: unknown): void })();
    return { postMessage: (msg) => vscode.postMessage(msg) };
  }

  if (typeof g["__morphqlSend"] === "function") {
    const send = g["__morphqlSend"] as (json: string) => void;
    return { postMessage: (msg) => send(JSON.stringify(msg)) };
  }

  return { postMessage: (msg) => console.log("[MorphQL Panel → Host]", msg) };
}

const host = createBridge();

// ── Tab switching ─────────────────────────────────────────────────────

document.querySelectorAll<HTMLButtonElement>(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".pane").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("pane-" + tab.dataset["pane"])!.classList.add("active");
  });
});

// ── Source file buttons ───────────────────────────────────────────────

document.getElementById("btn-open-source")!.addEventListener("click", () => {
  host.postMessage({ type: "openSourceFile" });
});
document.getElementById("btn-change-source")!.addEventListener("click", () => {
  host.postMessage({ type: "selectSourceFile" });
});

// ── Message handler ───────────────────────────────────────────────────

window.addEventListener("message", async ({ data: msg }) => {
  if (msg.type === "noQuery") {
    document.getElementById("filename")!.textContent = "No MorphQL file active";
    setStatus("idle", "Idle");
    setSourceFile(null);
    showEmpty();
    resetCode();
    renderStructure(null);
    return;
  }

  if (msg.type === "data") {
    const { query, sourceData, fileName, sourceFileName } = msg as {
      query: string;
      sourceData: string;
      fileName: string;
      sourceFileName: string | null;
    };

    document.getElementById("filename")!.textContent = fileName;
    setSourceFile(sourceFileName);

    try {
      const engine = (await compile(query, { analyze: true } as Parameters<typeof compile>[1])) as (
        data: string
      ) => unknown & { code?: string; analysis?: unknown };

      const output = (engine as unknown as (d: string) => unknown)(sourceData ?? "{}");
      const result =
        typeof output === "string" ? output : JSON.stringify(output, null, 2);

      setStatus("ok", "OK");
      showOutput(result);

      const code = (engine as unknown as { code?: string }).code ?? "";
      if (code) {
        document.getElementById("code-empty")!.style.display = "none";
        document.getElementById("code-output")!.style.display = "block";
        const codeInner = document.getElementById("code-code")!;
        codeInner.textContent = code;
        Prism.highlightElement(codeInner);
      } else {
        resetCode();
      }

      renderStructure((engine as unknown as { analysis?: unknown }).analysis ?? null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus("err", "Error");
      showError(msg);
      resetCode();
      renderStructure(null);
    }
  }
});

// ── UI helpers ────────────────────────────────────────────────────────

function setSourceFile(name: string | null) {
  const nameEl = document.getElementById("source-name")!;
  const openBtn = document.getElementById("btn-open-source") as HTMLButtonElement;
  if (name) {
    nameEl.textContent = name;
    nameEl.classList.remove("none");
    openBtn.style.display = "";
  } else {
    nameEl.textContent = "no source file";
    nameEl.classList.add("none");
    openBtn.style.display = "none";
  }
}

function setStatus(cls: string, text: string) {
  const el = document.getElementById("status")!;
  el.className = "status status-" + cls;
  el.textContent = text;
}

function showEmpty() {
  document.getElementById("result-empty")!.style.display = "flex";
  document.getElementById("result-output")!.style.display = "none";
  document.getElementById("result-error")!.style.display = "none";
}

function detectLang(text: string): string {
  const t = text.trim();
  if (t.startsWith("{") || t.startsWith("[")) return "json";
  if (t.startsWith("<")) return "markup";
  return "plaintext";
}

function showOutput(text: string) {
  document.getElementById("result-empty")!.style.display = "none";
  document.getElementById("result-output")!.style.display = "block";
  document.getElementById("result-error")!.style.display = "none";
  const codeEl = document.getElementById("result-code")!;
  codeEl.textContent = text;
  codeEl.className = "language-" + detectLang(text);
  Prism.highlightElement(codeEl);
}

function showError(message: string) {
  document.getElementById("result-empty")!.style.display = "none";
  document.getElementById("result-output")!.style.display = "none";
  document.getElementById("result-error")!.style.display = "block";
  document.getElementById("result-error-msg")!.textContent = message;
}

function resetCode() {
  document.getElementById("code-empty")!.style.display = "flex";
  document.getElementById("code-output")!.style.display = "none";
  document.getElementById("code-code")!.textContent = "";
}

// ── Structure tree ────────────────────────────────────────────────────

function renderStructure(analysis: unknown) {
  const container = document.getElementById("structure-tree")!;
  const a = analysis as { source?: unknown; target?: unknown } | null;

  if (!a || (!a.source && !a.target)) {
    container.innerHTML =
      '<div class="empty-state" style="padding:20px 0">No structure detected</div>';
    return;
  }

  let html = "";
  if (a.source) {
    html += '<div class="tree-label">Input Structure</div>';
    html += renderNode(a.source, null);
  }
  if (a.source && a.target) {
    html += '<div class="tree-divider"></div>';
  }
  if (a.target) {
    html += '<div class="tree-label">Output Structure</div>';
    html += renderNode(a.target, null);
  }
  container.innerHTML = html;
}

function renderNode(node: unknown, name: string | null): string {
  if (!node) return "";
  const n = node as {
    type?: string;
    isOpen?: boolean;
    properties?: Record<string, unknown>;
    items?: unknown;
  };
  const hasProps = n.properties && Object.keys(n.properties).length > 0;
  const hasItems = !!n.items;
  const isLeaf = !hasProps && !hasItems;

  const nameHtml = name != null ? '<span class="fname">' + esc(name) + ":</span> " : "";
  const openBadge = n.isOpen ? '<span class="open-badge">(open)</span>' : "";
  const typeHtml =
    '<span class="ftype t-' +
    esc(n.type ?? "unknown") +
    '">' +
    esc(n.type ?? "unknown") +
    openBadge +
    "</span>";

  if (isLeaf) {
    return (
      '<details class="leaf"><summary>' +
      '<span class="leaf-spacer"></span>' +
      nameHtml +
      typeHtml +
      "</summary></details>"
    );
  }

  let children = "";
  if (hasProps && n.properties) {
    for (const [k, v] of Object.entries(n.properties)) {
      children += renderNode(v, k);
    }
  }
  if (hasItems) children += renderNode(n.items, "items[]");

  return (
    "<details open><summary>" +
    '<span class="chevron">▶</span>' +
    nameHtml +
    typeHtml +
    "</summary>" +
    children +
    "</details>"
  );
}

function esc(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
