# project-mcp

Project MCP is a Visual Studio Code extension for managing and launching MCP servers defined in a `project.mcp.json` file within your workspace. It provides a convenient way to register and refresh MCP server definitions for your projects.

## Features

- Automatically detects `.vscode/project.mcp.json` in your workspace or parent folders
- Registers MCP servers defined in the JSON file
- Manual refresh command (`Project MCP: Refresh`)
- Supports custom server commands, arguments, and environment variables

## Usage

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
