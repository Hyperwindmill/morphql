import * as vscode from "vscode";
import {
  generateHoverDocs,
  type DocEntry,
} from "@morphql/language-definitions";

const { keywordDocs, functionDocs } = generateHoverDocs();

export class MQLHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const word = document.getText(range);

    // Check if it's a keyword
    const keywordDoc = keywordDocs[word.toLowerCase()];
    if (keywordDoc) {
      return new vscode.Hover(this.formatDocumentation(keywordDoc), range);
    }

    // Check if it's a function
    const functionDoc = functionDocs[word.toLowerCase()];
    if (functionDoc) {
      return new vscode.Hover(this.formatDocumentation(functionDoc), range);
    }

    return null;
  }

  private formatDocumentation(doc: DocEntry): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // Signature
    md.appendCodeblock(doc.signature, "mql");

    // Description
    md.appendMarkdown(doc.description);
    md.appendMarkdown("\n\n");

    // Parameters
    if (doc.parameters && doc.parameters.length > 0) {
      md.appendMarkdown("**Parameters:**\n\n");
      doc.parameters.forEach((param) => {
        md.appendMarkdown(`- \`${param.name}\`: ${param.description}\n`);
      });
      md.appendMarkdown("\n");
    }

    // Returns
    if (doc.returns) {
      md.appendMarkdown(`**Returns:** \`${doc.returns}\`\n\n`);
    }

    // Example
    if (doc.example) {
      md.appendMarkdown("**Example:**\n\n");
      md.appendCodeblock(doc.example, "mql");
    }

    return md;
  }
}
