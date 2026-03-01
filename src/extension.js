const vscode = require("vscode");

function activate(context) {

  vscode.window.showInformationMessage(
    "Dev-Sena activated 🚀"
  );
  const startExec =
    vscode.window.onDidStartTerminalShellExecution((event) => {
      
      const cmd =
        event.execution.commandLine.value;

      console.log("Command started:", cmd);

      // AI-ish detection example
      if (cmd.includes("npm run")) {
        vscode.window.showInformationMessage(
          "🚀 Running npm script..."
        );
      }

      if (cmd.includes("python") || cmd.includes("python3") || cmd.includes("py") || cmd.includes("pip") || cmd.includes("pip3")) {
        vscode.window.showInformationMessage(
          "🐍 Python script running..."
        );
      }
    });

  const endExec =
    vscode.window.onDidEndTerminalShellExecution((event) => {

      if (event.exitCode !== 0) {
        vscode.window.showErrorMessage(
          "❌ Command failed. Check logs."
        );
      }
    });

  context.subscriptions.push(startExec);
  context.subscriptions.push(endExec);
}

function deactivate() {}

module.exports = { activate, deactivate };