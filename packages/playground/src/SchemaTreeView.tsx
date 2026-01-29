import { useState } from "react";
import { Play } from "lucide-react";

export interface SchemaNode {
  type: string;
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
  isOpen?: boolean;
}

export interface SchemaTreeViewProps {
  node: SchemaNode | null | undefined;
  name?: string;
}

export function SchemaTreeView({ node, name }: SchemaTreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!node) return null;

  const hasProperties =
    node.properties && Object.keys(node.properties).length > 0;
  const hasItems = node.items;
  const isExpandable = hasProperties || hasItems;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "string":
        return "text-emerald-400";
      case "number":
        return "text-amber-400";
      case "boolean":
        return "text-indigo-400";
      case "array":
        return "text-pink-400";
      case "object":
        return "text-slate-400";
      default:
        return "text-slate-500";
    }
  };

  return (
    <div className="pl-4">
      <div className="flex items-center gap-2 py-0.5 group">
        {isExpandable ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-slate-800 rounded transition-colors text-slate-500">
            <Play
              className={`w-3 h-3 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
        ) : (
          <div className="w-4" />
        )}

        {name && (
          <span className="text-xs font-mono text-slate-300">{name}:</span>
        )}

        <span
          className={`text-[10px] uppercase font-bold ${getTypeColor(
            node.type,
          )} tracking-wider opacity-80`}>
          {node.type}
          {node.isOpen && (
            <span className="text-[10px] text-indigo-400 ml-1 italic">
              (open)
            </span>
          )}
        </span>
      </div>

      {isExpanded && (
        <div>
          {hasProperties &&
            Object.entries(node.properties!).map(([propName, propNode]) => (
              <SchemaTreeView key={propName} name={propName} node={propNode} />
            ))}
          {hasItems && <SchemaTreeView name="items" node={node.items} />}
        </div>
      )}
    </div>
  );
}
