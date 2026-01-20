import * as vscode from "vscode";
import { compile } from "@query-morph/core";

export class MQLDiagnosticProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private timeout: NodeJS.Timeout | undefined;

  constructor() {
    this.diagnosticCollection =
      vscode.languages.createDiagnosticCollection("mql");
  }

  public activate(context: vscode.ExtensionContext) {
    // Listen to document changes
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "mql") {
          this.scheduleValidation(event.document);
        }
      }),
    );

    // Listen to document open
    context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument((document) => {
        if (document.languageId === "mql") {
          this.validateDocument(document);
        }
      }),
    );

    // Listen to document save
    context.subscriptions.push(
      vscode.workspace.onDidSaveTextDocument((document) => {
        if (document.languageId === "mql") {
          this.validateDocument(document);
        }
      }),
    );

    // Validate all open MQL documents
    vscode.workspace.textDocuments.forEach((document) => {
      if (document.languageId === "mql") {
        this.validateDocument(document);
      }
    });

    context.subscriptions.push(this.diagnosticCollection);
  }

  private scheduleValidation(document: vscode.TextDocument) {
    // Debounce validation to avoid running on every keystroke
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.validateDocument(document);
    }, 500); // 500ms debounce
  }

  private async validateDocument(document: vscode.TextDocument) {
    const diagnostics: vscode.Diagnostic[] = [];

    try {
      // Try to compile the document
      await compile(document.getText());

      // If successful, clear diagnostics
      this.diagnosticCollection.set(document.uri, []);
    } catch (error: any) {
      // Parse error and create diagnostic
      const diagnostic = this.createDiagnostic(error, document);
      if (diagnostic) {
        diagnostics.push(diagnostic);
      }

      this.diagnosticCollection.set(document.uri, diagnostics);
    }
  }

  private createDiagnostic(
    error: any,
    document: vscode.TextDocument,
  ): vscode.Diagnostic | null {
    const message = error.message || String(error);

    let range: vscode.Range;
    let line = 0;
    let column = 0;
    let found = false;

    // Try to extract position from Chevrotain token if available
    if (error.token) {
      if (error.token.startLine !== undefined) {
        line = error.token.startLine - 1; // Convert to 0-indexed
        column =
          error.token.startColumn !== undefined
            ? error.token.startColumn - 1
            : 0;
        found = true;
      }
    }

    // Fallback: Try to extract from error message
    if (!found) {
      const lineMatch = message.match(/line[:\s]+(\d+)/i);
      const columnMatch = message.match(/column[:\s]+(\d+)/i);

      if (lineMatch) {
        line = parseInt(lineMatch[1], 10) - 1;
        column = columnMatch ? parseInt(columnMatch[1], 10) - 1 : 0;
        found = true;
      }
    }

    // Fallback: Look for "at offset" or similar patterns
    if (!found) {
      const offsetMatch = message.match(/offset[:\s]+(\d+)/i);
      if (offsetMatch) {
        const offset = parseInt(offsetMatch[1], 10);
        const pos = document.positionAt(offset);
        line = pos.line;
        column = pos.character;
        found = true;
      }
    }

    // Create range
    if (found && line < document.lineCount) {
      const lineText = document.lineAt(line).text;

      // Try to highlight the problematic token
      let endColumn = column;

      // If we have token info, use its length
      if (error.token && error.token.image) {
        endColumn = column + error.token.image.length;
      } else {
        // Otherwise, highlight next word or 10 chars
        const remainingText = lineText.substring(column);
        const wordMatch = remainingText.match(/^\S+/);
        endColumn =
          column +
          (wordMatch
            ? wordMatch[0].length
            : Math.min(10, remainingText.length));
      }

      range = new vscode.Range(
        new vscode.Position(line, column),
        new vscode.Position(line, Math.min(endColumn, lineText.length)),
      );
    } else {
      // Last resort: highlight first line
      range = new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(0, Math.min(10, document.lineAt(0).text.length)),
      );
    }

    return new vscode.Diagnostic(
      range,
      message,
      vscode.DiagnosticSeverity.Error,
    );
  }

  public dispose() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.diagnosticCollection.dispose();
  }
}
