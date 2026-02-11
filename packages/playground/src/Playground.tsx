import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Code,
  Database,
  FileCode,
  Copy,
  Check,
  Info,
} from "lucide-react";
import { compile } from "@morphql/core";
import { EXAMPLES } from "./examples";
import { registerMorphQLLanguage } from "./morphqlLanguage";
import { SchemaTreeView } from "./SchemaTreeView";
import "./index.css";

interface Result {
  result: string;
  generatedCode: string;
  error: string | null;
  analysis?: any;
}

export interface PlaygroundProps {
  initialQuery?: string;
  initialSourceData?: string;
  className?: string;
  onQueryChange?: (query: string) => void;
  onSourceDataChange?: (sourceData: string) => void;
}

export function Playground({
  initialQuery = EXAMPLES[0].query,
  initialSourceData = EXAMPLES[0].source,
  className = "",
  onQueryChange,
  onSourceDataChange,
}: PlaygroundProps) {
  const [query, setQuery] = useState(initialQuery);
  const [sourceData, setSourceData] = useState(initialSourceData);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<Result>({
    result: "",
    generatedCode: "",
    error: null,
  });
  const [leftTab, setLeftTab] = useState<"query" | "js" | "source">("query");
  const [rightTab, setRightTab] = useState<"output" | "structure">("output");

  const getSourceType = (data: string) => {
    const trimmed = data.trim();
    if (trimmed.startsWith("<")) return "xml";
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
    return "plaintext";
  };

  const sourceType = getSourceType(sourceData);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSourceData(initialSourceData);
  }, [initialSourceData]);

  useEffect(() => {
    async function run() {
      try {
        const morph = await compile(query, { analyze: true });
        const output = morph(sourceData);
        setResult({
          result:
            typeof output === "string"
              ? output
              : JSON.stringify(output, null, 2),
          generatedCode: morph.code,
          error: null,
          analysis: morph.analysis,
        });
      } catch (err: unknown) {
        setResult({
          result: "",
          generatedCode: "",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    run();
  }, [query, sourceData]);

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const example = EXAMPLES.find((ex) => ex.name === e.target.value);
    if (example) {
      setQuery(example.query);
      setSourceData(example.source);
      onQueryChange?.(example.query);
      onSourceDataChange?.(example.source);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQueryChange = (v: string | undefined) => {
    const newQuery = v || "";
    setQuery(newQuery);
    onQueryChange?.(newQuery);
  };

  const handleSourceDataChange = (v: string | undefined) => {
    const newData = v || "";
    setSourceData(newData);
    onSourceDataChange?.(newData);
  };

  return (
    <div
      className={`flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              MorphQL Playground
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              High-Performance Query-to-Code Engine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 text-slate-200 outline-none cursor-pointer"
            onChange={handleExampleChange}
            defaultValue="">
            <option value="" disabled>
              Load Example...
            </option>
            {EXAMPLES.map((ex) => (
              <option key={ex.name} value={ex.name}>
                {ex.name}
              </option>
            ))}
          </select>
          <a
            href="https://hyperwindmill.github.io/morphql"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
            Documentation
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Query, JS, Source Tabs */}
        <div className="w-1/2 flex flex-col border-r border-slate-800">
          <div className="flex items-center gap-1 px-4 py-2 bg-slate-900 border-b border-slate-800">
            <button
              onClick={() => setLeftTab("query")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                leftTab === "query"
                  ? "bg-slate-800 text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}>
              <FileCode className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Morph Query
              </span>
            </button>
            <button
              onClick={() => setLeftTab("js")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                leftTab === "js"
                  ? "bg-slate-800 text-amber-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}>
              <Code className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Generated JS
              </span>
            </button>
            <button
              onClick={() => setLeftTab("source")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                leftTab === "source"
                  ? "bg-slate-800 text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}>
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Source Data
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <div
              className={`h-full flex flex-col pt-2 bg-[#1e1e1e] ${
                leftTab === "query" ? "block" : "hidden"
              }`}>
              <Editor
                theme="vs-dark"
                defaultLanguage="morphql"
                value={query}
                onChange={handleQueryChange}
                beforeMount={(monaco) => {
                  registerMorphQLLanguage(monaco);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10 },
                }}
              />
            </div>
            <div
              className={`h-full flex flex-col pt-2 bg-[#1e1e1e] ${
                leftTab === "js" ? "block" : "hidden"
              }`}>
              <Editor
                theme="vs-dark"
                defaultLanguage="javascript"
                value={result.generatedCode}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10 },
                }}
              />
            </div>
            <div
              className={`h-full flex flex-col pt-2 bg-[#1e1e1e] ${
                leftTab === "source" ? "block" : "hidden"
              }`}>
              <Editor
                theme="vs-dark"
                language={sourceType}
                value={sourceData}
                onChange={handleSourceDataChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10 },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Output & Structure Tabs */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRightTab("output")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                  rightTab === "output"
                    ? "bg-slate-800 text-amber-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                }`}>
                <Play className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Transformation Result
                </span>
              </button>
              <button
                onClick={() => setRightTab("structure")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                  rightTab === "structure"
                    ? "bg-slate-800 text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                }`}>
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Structure
                </span>
              </button>
            </div>
            {rightTab === "output" && (
              <button
                onClick={copyToClipboard}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                title="Copy Result">
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            <div
              className={`h-full flex flex-col pt-2 ${
                rightTab === "output" ? "block" : "hidden"
              }`}>
              {result.error ? (
                <div className="p-4 flex gap-3 text-red-400 bg-red-950/20 m-4 rounded-lg border border-red-900/50">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold mb-1">
                      Compilation/Execution Error
                    </p>
                    <p className="text-xs font-mono">{result.error}</p>
                  </div>
                </div>
              ) : (
                <Editor
                  theme="vs-dark"
                  language={getSourceType(result.result)}
                  value={result.result}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 10 },
                  }}
                />
              )}
            </div>
            {rightTab === "structure" && (
              <div className="h-full flex flex-col divide-y divide-slate-800 overflow-hidden">
                {/* Source Structure */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-4 py-1.5 bg-slate-900/50 flex items-center justify-between border-b border-slate-800">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Input Structure
                    </span>
                    <Database className="w-3 h-3 text-slate-600" />
                  </div>
                  <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    {result.analysis?.source ? (
                      <SchemaTreeView node={result.analysis.source} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-600 italic text-xs">
                        No input structure detected
                      </div>
                    )}
                  </div>
                </div>

                {/* Target Structure */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-4 py-1.5 bg-slate-900/50 flex items-center justify-between border-b border-slate-800">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Output Structure
                    </span>
                    <Play className="w-3 h-3 text-slate-600" />
                  </div>
                  <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    {result.analysis?.target ? (
                      <SchemaTreeView node={result.analysis.target} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-600 italic text-xs">
                        No output structure detected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-2 border-t border-slate-800 bg-[#1e293b] flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            Version: 0.1.17
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-medium italic">
          MorphQL Engine &copy; 2026
        </div>
      </footer>
    </div>
  );
}
