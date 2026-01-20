"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQLDiagnosticProvider = void 0;
const vscode = __importStar(require("vscode"));
const core_1 = require("@query-morph/core");
class MQLDiagnosticProvider {
    constructor() {
        this.diagnosticCollection =
            vscode.languages.createDiagnosticCollection("mql");
    }
    activate(context) {
        // Listen to document changes
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
            if (event.document.languageId === "mql") {
                this.scheduleValidation(event.document);
            }
        }));
        // Listen to document open
        context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((document) => {
            if (document.languageId === "mql") {
                this.validateDocument(document);
            }
        }));
        // Listen to document save
        context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
            if (document.languageId === "mql") {
                this.validateDocument(document);
            }
        }));
        // Validate all open MQL documents
        vscode.workspace.textDocuments.forEach((document) => {
            if (document.languageId === "mql") {
                this.validateDocument(document);
            }
        });
        context.subscriptions.push(this.diagnosticCollection);
    }
    scheduleValidation(document) {
        // Debounce validation to avoid running on every keystroke
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.validateDocument(document);
        }, 500); // 500ms debounce
    }
    async validateDocument(document) {
        const diagnostics = [];
        try {
            // Try to compile the document
            await (0, core_1.compile)(document.getText());
            // If successful, clear diagnostics
            this.diagnosticCollection.set(document.uri, []);
        }
        catch (error) {
            // Parse error and create diagnostic
            const diagnostic = this.createDiagnostic(error, document);
            if (diagnostic) {
                diagnostics.push(diagnostic);
            }
            this.diagnosticCollection.set(document.uri, diagnostics);
        }
    }
    createDiagnostic(error, document) {
        const message = error.message || String(error);
        // Try to extract line/column info from error message
        // Chevrotain errors often include position info
        const lineMatch = message.match(/line[:\s]+(\d+)/i);
        const columnMatch = message.match(/column[:\s]+(\d+)/i);
        let range;
        if (lineMatch) {
            const line = parseInt(lineMatch[1], 10) - 1; // Convert to 0-indexed
            const column = columnMatch ? parseInt(columnMatch[1], 10) - 1 : 0;
            // Try to get the end of the token
            const lineText = document.lineAt(Math.min(line, document.lineCount - 1)).text;
            const endColumn = Math.min(column + 10, lineText.length); // Highlight ~10 chars
            range = new vscode.Range(new vscode.Position(line, column), new vscode.Position(line, endColumn));
        }
        else {
            // Default to first line if no position info
            range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10));
        }
        return new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
    }
    dispose() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.diagnosticCollection.dispose();
    }
}
exports.MQLDiagnosticProvider = MQLDiagnosticProvider;
//# sourceMappingURL=diagnosticProvider.js.map