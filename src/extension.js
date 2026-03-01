const vscode = require("vscode");

/* =========================
   GLOBALS (V3 SPEEDOMETER)
========================= */
let statusBar;
let keyCount = 0;
let startTime = Date.now();
let lastTypingTime = Date.now();
let idleTimer;

/* =========================
   ACTIVATE EXTENSION
========================= */
function activate(context) {

  vscode.window.showInformationMessage("Dev-Sena activated 🚀");

  /* ===== V3 SPEEDOMETER ===== */
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );

  statusBar.show();

  context.subscriptions.push(statusBar);
  vscode.window.showInformationMessage("⚡ Speedometer enabled! Type to see your CPM.");

  // Detect typing (ignore backspace/delete)
  const typingListener =
    vscode.workspace.onDidChangeTextDocument((event) => {

      let addedChars = 0;

      event.contentChanges.forEach(change => {
        if (change.text && change.text.length > 0) {
          addedChars += change.text.length;
        }
      });

      // Ignore deletions
      if (addedChars === 0) return;

      keyCount += addedChars;
      lastTypingTime = Date.now();

      updateSpeed();

      // Reset after 20s idle
      clearTimeout(idleTimer);

      idleTimer = setTimeout(() => {
        keyCount = 0;
        startTime = Date.now();
        statusBar.text = "⚡ Speed: 0 CPM";
      }, 10000);
    });

  context.subscriptions.push(typingListener);

  /* ===== V1 LOG WATCHER ===== */
  const startExec =
    vscode.window.onDidStartTerminalShellExecution((event) => {

      const cmd =
        event.execution.commandLine.value.toLowerCase();

      if (cmd.includes("npm run")) {
        vscode.window.showInformationMessage(
          "🚀 Running npm script..."
        );
      }

      if (cmd.includes("python")) {
        vscode.window.showInformationMessage(
          "🐍 Python script running..."
        );
      }
    });

  /* ===== V2 ERROR EXPLAINER ===== */
  const endExec =
    vscode.window.onDidEndTerminalShellExecution((event) => {

      const cmd =
        event.execution.commandLine.value.toLowerCase();

      if (event.exitCode !== 0) {

        if (cmd.startsWith("npm run")) {
          vscode.window.showErrorMessage(
            "❌ npm script failed. Check package.json scripts."
          );
          return;
        }

        if (cmd.startsWith("node")) {
          vscode.window.showErrorMessage(
            "📦 Node command failed. Check file path or dependencies."
          );
          return;
        }

        if (cmd.startsWith("python")) {
          vscode.window.showErrorMessage(
            "🐍 Python execution failed. Check environment or packages."
          );
          return;
        }

        if (!cmd.includes(" ")) {
          vscode.window.showErrorMessage(
            "⚠️ Command not recognized. Check spelling or install it."
          );
          return;
        }

        vscode.window.showErrorMessage(
          "❌ Command failed — check terminal output."
        );
      }
    });

  context.subscriptions.push(startExec);
  context.subscriptions.push(endExec);
}

/* =========================
   SPEED CALCULATION
========================= */
function updateSpeed() {

  const minutes =
    (Date.now() - startTime) / 60000;

  const cpm =
    Math.max(0, Math.floor(keyCount / minutes || 0));

  statusBar.text = `⚡ Speed: ${cpm} CPM`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};