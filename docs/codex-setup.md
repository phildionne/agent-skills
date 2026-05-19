# Codex Setup

This repo documents Codex agent setup, but does not apply or rewrite Codex config.

Codex auth, MCP tokens, marketplace/plugin cache files, logs, memories, project trust history, and runtime cache are local machine state. Keep them out of this repo.

## Expected MCP Servers

Defined in `~/.codex/config.toml` and checked by `pnpm run doctor`:

- `chrome-devtools`: enabled command MCP.
- `context7`: enabled command MCP.
- `github`: disabled URL MCP; authorization is local-only.
- `mapbox`: disabled command MCP; `MAPBOX_ACCESS_TOKEN` is local-only.
- `next-devtools`: enabled command MCP.
- `playwright`: enabled command MCP.
- `shadcn`: enabled command MCP.

## Expected Plugins

Enabled plugins checked by `pnpm run doctor`:

- `browser@openai-bundled`
- `chrome@openai-bundled`
- `codex-security@openai-curated`
- `computer-use@openai-bundled`
- `documents@openai-primary-runtime`
- `github@openai-curated`
- `google-drive@openai-curated`
- `neon-postgres@openai-curated`
- `presentations@openai-primary-runtime`
- `sentry@openai-curated`
- `slack@openai-curated`
- `spreadsheets@openai-primary-runtime`
