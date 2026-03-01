const vscode = require("vscode");

/* =========================
   DEV-SENA ERROR BRAIN (V2)
========================= */
// const ERROR_DICTIONARY = {
// 	"missing script":
// 		"❌ npm script not found. Check package.json → scripts section.",
// 	module_not_found: "📦 Module missing. Try running: npm install",
// 	econnrefused: "🔌 Connection refused. Server may not be running.",
// 	"command not found":
// 		"⚠️ Command not recognized. Check spelling or install package.",
// };

/* =========================
   ACTIVATE EXTENSION
========================= */
function activate(context) {
	vscode.window.showInformationMessage("Dev-Sena activated 🚀");

	/* =========================
     V1 — LOG WATCHER
  ========================= */
	const startExec = vscode.window.onDidStartTerminalShellExecution((event) => {
		const cmd = event.execution.commandLine.value.toLowerCase();

		console.log("Command started:", cmd);

		// simple AI-ish hints
		if (cmd.includes("npm run")) {
			vscode.window.showInformationMessage("🚀 Running npm script...");
		}

		if (cmd.includes("python")) {
			vscode.window.showInformationMessage("🐍 Python script running...");
		}
	});

	/* =========================
     V2 — ERROR EXPLAINER
  ========================= */
	const endExec =
  vscode.window.onDidEndTerminalShellExecution((event) => {

    const cmd =
      event.execution.commandLine.value.toLowerCase();

    // command failed
    if (event.exitCode !== 0) {

      // npm script failed
      if (cmd.startsWith("npm run")) {
        vscode.window.showErrorMessage(
          "❌ npm script failed. Check package.json → scripts section."
        );
        return;
      }

      // node execution failed
      if (cmd.startsWith("node")) {
        vscode.window.showErrorMessage(
          "📦 Node execution failed. Check file path or missing modules."
        );
        return;
      }

      // python failed
      if (cmd.startsWith("python")) {
        vscode.window.showErrorMessage(
          "🐍 Python command failed. Check environment or dependencies."
        );
        return;
      }

      // command not found (best guess)
      if (!cmd.includes(" ")) {
        vscode.window.showErrorMessage(
          "⚠️ Command not recognized. Check spelling or installation."
        );
        return;
      }

      // fallback
      vscode.window.showErrorMessage(
        "❌ Command failed — check terminal output."
      );
    }
  });

	context.subscriptions.push(startExec);
	context.subscriptions.push(endExec);
}

/* =========================
   DEACTIVATE
========================= */
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
