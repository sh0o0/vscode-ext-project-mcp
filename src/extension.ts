import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	const emitter = new vscode.EventEmitter<void>();
	context.subscriptions.push(emitter);

	// 手動リフレッシュコマンド
	const refreshCmd = vscode.commands.registerCommand('project-mcp.refresh', () => {
		emitter.fire();
		vscode.window.showInformationMessage('Project MCP refreshed.');
	});
	context.subscriptions.push(refreshCmd);

	// MCP サーバー定義プロバイダーの登録
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
		vscode.lm.registerMcpServerDefinitionProvider('project-mcp', provider)
	);
}

/**
 * startUri から上位ディレクトリを辿り、最初に見つかった .vscode/project.mcp.json の URI を返す
 */
async function findUpConfig(startUri: vscode.Uri): Promise<vscode.Uri | null> {
	let current = startUri.fsPath;

	while (true) {
		const configPath = path.join(current, '.vscode', 'project.mcp.json');
		const configUri = vscode.Uri.file(configPath);

		try {
			await vscode.workspace.fs.stat(configUri);
			return configUri;
		} catch {
			// 存在しない場合は親へ
		}

		const parent = path.dirname(current);
		if (parent === current) {
			break; // ルート到達
		}
		current = parent;
	}

	return null;
}

export function deactivate() { }
