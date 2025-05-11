import * as vscode from 'vscode';
import * as path from 'path';

const VSCODE_DIR = '.vscode';
const PROJECT_MCP_JSON = 'project.mcp.json';
const EXTENSION_ID = 'project-mcp';
const COMMAND_REFRESH_ID = `${EXTENSION_ID}.refresh`;

export function activate(context: vscode.ExtensionContext) {
	const emitter = new vscode.EventEmitter<void>();
	context.subscriptions.push(emitter);

	// Manual refresh command
	const refreshCmd = vscode.commands.registerCommand(COMMAND_REFRESH_ID, () => {
		emitter.fire();
		vscode.window.showInformationMessage('Project MCP refreshed.');
	});
	context.subscriptions.push(refreshCmd);

	// Register MCP server definition provider
	const provider: vscode.McpServerDefinitionProvider = {
		onDidChangeMcpServerDefinitions: emitter.event,
		provideMcpServerDefinitions: async () => {
			const defs: vscode.McpServerDefinition[] = [];
			const folders = vscode.workspace.workspaceFolders;
			if (!folders) {
				return defs;
			}

			for (const folder of folders) {
				const configUri = await findUpConfig(folder.uri);
				if (!configUri) {
					continue;
				}

				try {
					const buf = await vscode.workspace.fs.readFile(configUri);
					const json = JSON.parse(buf.toString());

					if (typeof json.servers === 'object' && json.servers !== null) {
						for (const [label, server] of Object.entries(json.servers)) {
							defs.push(
								new vscode.McpStdioServerDefinition(
									label,
									server.command,
									Array.isArray(server.args) ? server.args : [],
									typeof server.env === 'object' ? server.env : {}
								)
							);
						}
					} else {
						vscode.window.showWarningMessage(`.vscode/project.mcp.json: "servers" object not found in ${configUri.fsPath}`);
					}
				} catch (err) {
					vscode.window.showErrorMessage(`Failed to load MCP config: ${err}`);
				}
			}


			return defs;
		}
	};

	context.subscriptions.push(
		vscode.lm.registerMcpServerDefinitionProvider(EXTENSION_ID, provider)
	);

	// Refresh on workspace open
	emitter.fire();
}

/**
 * Traverse up from startUri and return the URI of the first found .vscode/project.mcp.json
 */
async function findUpConfig(startUri: vscode.Uri): Promise<vscode.Uri | null> {
	let current = startUri.fsPath;

	while (true) {
		const configPath = path.join(current, VSCODE_DIR, PROJECT_MCP_JSON);
		const configUri = vscode.Uri.file(configPath);

		try {
			await vscode.workspace.fs.stat(configUri);
			return configUri;
		} catch {
			// If not found, go to parent
		}

		const parent = path.dirname(current);
		if (parent === current) {
			break; // Reached root
		}
		current = parent;
	}

	return null;
}

export function deactivate() { }
