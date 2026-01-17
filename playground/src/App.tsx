import { useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Code, Database, FileCode, Copy, Check, Info } from 'lucide-react';
import { compile } from '../../src/index';

const DEFAULT_QUERY = `from json 
to xml("Order") 
transform 
  section order(
    set orderId=id
    section multiple items(
      set itemSku=sku
      section details(
        set hex=color
      ) from info
    ) from products
  )`;

const DEFAULT_DATA = JSON.stringify(
  {
    order: {
      id: 'ORD-12345',
      products: [
        { sku: 'SKU-99', info: { color: '#ff0000' } },
        { sku: 'SKU-88', info: { color: '#0000ff' } },
      ],
    },
  },
  null,
  2
);

export default function App() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [sourceData, setSourceData] = useState(DEFAULT_DATA);
  const [copied, setCopied] = useState(false);

  const { result, generatedCode, error } = useMemo(() => {
    try {
      const morph = compile(query);
      const output = morph(sourceData);
      return {
        result: typeof output === 'string' ? output : JSON.stringify(output, null, 2),
        generatedCode: morph.code,
        error: null,
      };
    } catch (err: unknown) {
      return {
        result: '',
        generatedCode: '',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }, [query, sourceData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Query Morph Playground
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              High-Performance Query-to-Code Engine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            Documentation
          </a>
          <button className="text-xs font-semibold px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 text-white">
            Share Query
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Query & JS */}
        <div className="w-1/2 flex flex-col border-r border-slate-800">
          {/* Top Half: Query */}
          <div className="h-1/2 flex flex-col border-b border-slate-800">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Morph Query
              </span>
            </div>
            <div className="flex-1 overflow-hidden pt-2">
              <Editor
                theme="vs-dark"
                defaultLanguage="sql"
                value={query}
                onChange={(v) => setQuery(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10 },
                }}
              />
            </div>
          </div>

          {/* Bottom Half: Generated JS */}
          <div className="h-1/2 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
              <Code className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Generated JS
              </span>
            </div>
            <div className="flex-1 overflow-hidden pt-2">
              <Editor
                theme="vs-dark"
                defaultLanguage="javascript"
                value={generatedCode}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10 },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Panels */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          {/* Top Right: Source Data */}
          <div className="h-1/2 flex flex-col border-b border-slate-800">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Source Data (JSON/XML)
              </span>
            </div>
            <div className="flex-1 overflow-hidden pt-2">
              <Editor
                theme="vs-dark"
                defaultLanguage="json"
                value={sourceData}
                onChange={(v) => setSourceData(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10 },
                }}
              />
            </div>
          </div>

          {/* Bottom Right: Result */}
          <div className="h-1/2 flex flex-col relative">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Transformation Result
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                title="Copy Result"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex-1 overflow-hidden pt-2 bg-[#1e1e1e]">
              {error ? (
                <div className="p-4 flex gap-3 text-red-400 bg-red-950/20 m-4 rounded-lg border border-red-900/50">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold mb-1">Compilation/Execution Error</p>
                    <p className="text-xs font-mono">{error}</p>
                  </div>
                </div>
              ) : (
                <Editor
                  theme="vs-dark"
                  language={result.trim().startsWith('<') ? 'xml' : 'json'}
                  value={result}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 10 },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-2 border-t border-slate-800 bg-[#1e293b] flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Engine Status: Online
            </span>
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            Version: 0.1.0-alpha
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-medium italic">
          Query Morph Engine &copy; 2026
        </div>
      </footer>
    </div>
  );
}
