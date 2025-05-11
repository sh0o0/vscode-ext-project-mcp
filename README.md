# project-mcp

**Note: As of May 2025, this extension is only available on VS Code Insiders. From June 2025, it will also be available on VS Code Stable.**

Project MCP is a Visual Studio Code extension that lets you define MCP servers available across your entire project. By placing a `project.mcp.json` file in your workspace, you can centrally manage and launch MCP servers for the whole project from a single configuration file.

It provides a convenient way to register and refresh MCP server definitions for your projects.

## Features

- Automatically detects `.vscode/project.mcp.json` in your workspace or parent folders
- Registers MCP servers defined in the JSON file
- Manual refresh command (`Project MCP: Refresh`)
- Supports custom server commands, arguments, and environment variables

## Usage

You can define MCP servers that are available project-wide by adding a `project.mcp.json` file under your workspace's `.vscode` directory. All team members and tools in the project can share these server definitions.

For example, if you have the following folder structure:

```
/parent-folder
  └─ .vscode/project.mcp.json
  └─ child-project/
      └─ (open this folder in VS Code)
```

When you open `child-project` in VS Code, Project MCP will automatically detect and use the `.vscode/project.mcp.json` from the parent folder.

1. Add a `project.mcp.json` file under your workspace's `.vscode` directory. Example:

```json
{
  "servers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"],
      "env": { "PORT": "3000" }
    }
  }
}
```

2. Use the command palette to run `Project MCP: Refresh` if you update the config.

## TODO

- Support for input prompts
- Support for non-stdin communication
- Allow specifying config path
- Allow selecting which MCP config to load if multiple are found

## Extension Settings

This extension does not contribute any settings yet.

## Known Issues

- Only supports `.vscode/project.mcp.json` (not configurable)
- No UI for managing servers

## Release Notes

### 0.0.1
- Initial release

---

**Enjoy using Project MCP!**

## References
- [vscode v1.100 update for mcp api](https://code.visualstudio.com/updates/v1_100#_mcp-servers-contributed-by-extensions)
- [mcp-extension-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/mcp-extension-sample)
