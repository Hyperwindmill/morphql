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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const core_1 = require("@query-morph/core");
const diagnosticProvider_1 = require("./diagnosticProvider");
const hoverProvider_1 = require("./hoverProvider");
let outputChannel;
function activate(context) {
    console.log("MQL extension is now active");
    // Create output channel for results
    outputChannel = vscode.window.createOutputChannel("MQL Output");
    // Register diagnostic provider
    const diagnosticProvider = new diagnosticProvider_1.MQLDiagnosticProvider();
    diagnosticProvider.activate(context);
    // Register hover provider
    const hoverProvider = new hoverProvider_1.MQLHoverProvider();
    context.subscriptions.push(vscode.languages.registerHoverProvider("mql", hoverProvider));
    // Register command: Execute with input data
    const executeWithInput = vscode.commands.registerCommand("mql.executeWithInput", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== "mql") {
            vscode.window.showErrorMessage("Please open an MQL file first");
            return;
        }
        const query = editor.document.getText();
        // Ask user for input data
        const inputData = await vscode.window.showInputBox({
            prompt: "Enter input data (JSON, XML, or leave empty for empty object)",
            placeHolder: '{"firstName": "John", "lastName": "Doe"}',
            ignoreFocusOut: true,
            validateInput: (value) => {
                if (!value)
                    return null; // Empty is OK
                try {
                    // Try to parse as JSON first
                    JSON.parse(value);
                    return null;
                }
                catch {
                    // If not JSON, assume it's XML (will be validated during execution)
                    if (value.trim().startsWith("<")) {
                        return null;
                    }
                    return "Invalid input: must be valid JSON or XML";
                }
            },
        });
        if (inputData === undefined) {
            return; // User cancelled
        }
        await executeQuery(query, inputData || "{}");
    });
    // Register command: Execute with clipboard data
    const executeFromClipboard = vscode.commands.registerCommand("mql.executeFromClipboard", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== "mql") {
            vscode.window.showErrorMessage("Please open an MQL file first");
            return;
        }
        const query = editor.document.getText();
        const clipboardData = await vscode.env.clipboard.readText();
        if (!clipboardData) {
            vscode.window.showWarningMessage("Clipboard is empty");
            return;
        }
        await executeQuery(query, clipboardData);
    });
    context.subscriptions.push(executeWithInput, executeFromClipboard, outputChannel);
}
async function executeQuery(query, inputData) {
    try {
        outputChannel.clear();
        outputChannel.show(true);
        outputChannel.appendLine("=".repeat(60));
        outputChannel.appendLine("MQL Execution Started");
        outputChannel.appendLine("=".repeat(60));
        outputChannel.appendLine("");
        outputChannel.appendLine("Query:");
        outputChannel.appendLine(query);
        outputChannel.appendLine("");
        outputChannel.appendLine("Input Data:");
        outputChannel.appendLine(inputData);
        outputChannel.appendLine("");
        outputChannel.appendLine("-".repeat(60));
        outputChannel.appendLine("");
        // Compile and execute
        const startTime = Date.now();
        const engine = await (0, core_1.compile)(query);
        const compileTime = Date.now() - startTime;
        const execStartTime = Date.now();
        const result = engine(inputData);
        const execTime = Date.now() - execStartTime;
        outputChannel.appendLine("✅ Execution Successful!");
        outputChannel.appendLine("");
        outputChannel.appendLine(`Compile Time: ${compileTime}ms`);
        outputChannel.appendLine(`Execution Time: ${execTime}ms`);
        outputChannel.appendLine("");
        outputChannel.appendLine("Result:");
        // Format result for better readability
        if (typeof result === "string") {
            // If result is XML or already formatted, show as-is
            if (result.trim().startsWith("<")) {
                outputChannel.appendLine(formatXml(result));
            }
            else {
                // Try to parse and format as JSON
                try {
                    const parsed = JSON.parse(result);
                    outputChannel.appendLine(JSON.stringify(parsed, null, 2));
                }
                catch {
                    outputChannel.appendLine(result);
                }
            }
        }
        else {
            // Object result, format as JSON
            outputChannel.appendLine(JSON.stringify(result, null, 2));
        }
        outputChannel.appendLine("");
        outputChannel.appendLine("=".repeat(60));
        // Show success message
        vscode.window.showInformationMessage(`MQL executed successfully in ${compileTime + execTime}ms`);
    }
    catch (error) {
        outputChannel.appendLine("");
        outputChannel.appendLine("❌ Execution Failed!");
        outputChannel.appendLine("");
        outputChannel.appendLine("Error:");
        outputChannel.appendLine(error.message || String(error));
        if (error.stack) {
            outputChannel.appendLine("");
            outputChannel.appendLine("Stack Trace:");
            outputChannel.appendLine(error.stack);
        }
        outputChannel.appendLine("");
        outputChannel.appendLine("=".repeat(60));
        vscode.window.showErrorMessage(`MQL execution failed: ${error.message}`);
    }
}
function formatXml(xml) {
    // Simple XML formatting
    let formatted = "";
    let indent = 0;
    const lines = xml.split(/>\s*</);
    lines.forEach((line, i) => {
        if (i > 0)
            line = "<" + line;
        if (i < lines.length - 1)
            line = line + ">";
        if (line.match(/^<\/\w/))
            indent--;
        formatted += "  ".repeat(Math.max(0, indent)) + line + "\n";
        if (line.match(/^<\w[^>]*[^\/]>$/))
            indent++;
    });
    return formatted.trim();
}
function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}
//# sourceMappingURL=extension.js.map