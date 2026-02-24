import * as vscode from "vscode";
import { compile } from "@morphql/core";
import { MorphQLDiagnosticProvider } from "./diagnosticProvider";
import { MorphQLHoverProvider } from "./hoverProvider";
import { MorphQLLivePanel } from "./livePanel";

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  console.log("MorphQL extension is now active");

  // Create output channel for results
  outputChannel = vscode.window.createOutputChannel("MorphQL Output");

  // Register diagnostic provider
  const diagnosticProvider = new MorphQLDiagnosticProvider();
  diagnosticProvider.activate(context);

  // Register hover provider
  const hoverProvider = new MorphQLHoverProvider();
  context.subscriptions.push(
    vscode.languages.registerHoverProvider("morphql", hoverProvider),
  );

  // Register command: Execute with input data
  const executeWithInput = vscode.commands.registerCommand(
    "morphql.executeWithInput",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "morphql") {
        vscode.window.showErrorMessage("Please open an MorphQL file first");
        return;
      }

      const query = editor.document.getText();

      // Ask user for input data
      const inputData = await vscode.window.showInputBox({
        prompt: "Enter input data (JSON, XML, or leave empty for empty object)",
        placeHolder: '{"firstName": "John", "lastName": "Doe"}',
        ignoreFocusOut: true,
        validateInput: (value) => {
          if (!value) return null; // Empty is OK
          try {
            // Try to parse as JSON first
            JSON.parse(value);
            return null;
          } catch {
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
    },
  );

  // Register command: Execute with clipboard data
  const executeFromClipboard = vscode.commands.registerCommand(
    "morphql.executeFromClipboard",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "morphql") {
        vscode.window.showErrorMessage("Please open an MorphQL file first");
        return;
      }

      const query = editor.document.getText();
      const clipboardData = await vscode.env.clipboard.readText();

      if (!clipboardData) {
        vscode.window.showWarningMessage("Clipboard is empty");
        return;
      }

      await executeQuery(query, clipboardData);
    },
  );

  // Register command: Execute selection (for embedded queries)
  const executeSelection = vscode.commands.registerCommand(
    "morphql.executeSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      // Get selected text or try to extract from tagged template
      let query = "";
      const selection = editor.selection;

      if (!selection.isEmpty) {
        // User has selected text
        query = editor.document.getText(selection);
      } else {
        vscode.window.showErrorMessage(
          "Please select the MorphQL query text to execute",
        );
        return;
      }

      // Ask for input data
      const inputData = await vscode.window.showInputBox({
        prompt: "Enter input data (JSON, XML, or leave empty for empty object)",
        placeHolder: '{"firstName": "John", "lastName": "Doe"}',
        ignoreFocusOut: true,
        validateInput: (value) => {
          if (!value) return null;
          try {
            JSON.parse(value);
            return null;
          } catch {
            if (value.trim().startsWith("<")) {
              return null;
            }
            return "Invalid input: must be valid JSON or XML";
          }
        },
      });

      if (inputData === undefined) {
        return;
      }

      await executeQuery(query, inputData || "{}");
    },
  );

  // Register command: Open Live Panel
  const openLivePanel = vscode.commands.registerCommand(
    "morphql.openLivePanel",
    () => MorphQLLivePanel.createOrShow(),
  );

  context.subscriptions.push(
    executeWithInput,
    executeFromClipboard,
    executeSelection,
    openLivePanel,
    outputChannel,
  );
}

async function executeQuery(query: string, inputData: string) {
  try {
    outputChannel.clear();
    outputChannel.show(true);
    outputChannel.appendLine("=".repeat(60));
    outputChannel.appendLine("MorphQL Execution Started");
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
    const engine = await compile(query);
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
      } else {
        // Try to parse and format as JSON
        try {
          const parsed = JSON.parse(result);
          outputChannel.appendLine(JSON.stringify(parsed, null, 2));
        } catch {
          outputChannel.appendLine(result);
        }
      }
    } else {
      // Object result, format as JSON
      outputChannel.appendLine(JSON.stringify(result, null, 2));
    }

    outputChannel.appendLine("");
    outputChannel.appendLine("=".repeat(60));

    // Show success message
    vscode.window.showInformationMessage(
      `MorphQL executed successfully in ${compileTime + execTime}ms`,
    );
  } catch (error: any) {
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

    vscode.window.showErrorMessage(`MorphQL execution failed: ${error.message}`);
  }
}

function formatXml(xml: string): string {
  // Simple XML formatting
  let formatted = "";
  let indent = 0;
  const lines = xml.split(/>\s*</);

  lines.forEach((line, i) => {
    if (i > 0) line = "<" + line;
    if (i < lines.length - 1) line = line + ">";

    if (line.match(/^<\/\w/)) indent--;
    formatted += "  ".repeat(Math.max(0, indent)) + line + "\n";
    if (line.match(/^<\w[^>]*[^\/]>$/)) indent++;
  });

  return formatted.trim();
}

export function deactivate() {
  if (outputChannel) {
    outputChannel.dispose();
  }
}
