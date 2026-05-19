# Agent Skills

Personal collection of skills for AI coding agents.

This repository is structured for compatibility with the [skills](https://github.com/vercel-labs/skills) CLI and follows the [Agent Skills](https://agentskills.io/) standard.

## Setup

Install dependencies:

```bash
pnpm install
```

Preview the skill installation commands:

```bash
pnpm bootstrap:dry-run
```

Install the skills declared in `agent-manifest.toml`:

```bash
pnpm bootstrap
```

Verify the local agent setup:

```bash
pnpm run doctor
```

Update installed global skills:

```bash
pnpm run skills:update
```

## Installation

Install the full collection from GitHub:

```bash
npx skills add phildionne/agent-skills
```

## Custom Skills

Custom skills are source-controlled under `skills/<skill-name>/` and should be treated as the editable source of truth. External skills belong in `agent-manifest.toml`; repo-owned skills belong in both `skills/` and the `[custom] skills = [...]` manifest list when they should be installed by the bootstrap workflow.

To add or update a custom skill:

1. Create or edit `skills/<skill-name>/SKILL.md`.
2. Add optional UI metadata, helper scripts, references, or assets under the same skill directory.
3. Add the skill name to `[custom] skills` in `agent-manifest.toml`.
4. Run `pnpm bootstrap:dry-run` to confirm the install command.
5. Run `pnpm run doctor` to verify the source directory and local agent setup.

Packaged zip files are optional distribution artifacts. Regenerate `skills/<skill-name>.zip` after changing a skill only when a packaged copy is needed.

### Repository Structure

- `skills/<skill-name>/SKILL.md` contains the skill definition
- `skills/<skill-name>/agents/openai.yaml` contains UI metadata when needed
- `skills/<skill-name>/scripts/` contains executable helpers
- `skills/<skill-name>/references/` contains load-on-demand documentation
- `skills/<skill-name>/assets/` contains templates and other output resources
- `skills/<skill-name>.zip` is the packaged distribution artifact

## Managed State

- `agent-manifest.toml` lists the desired external skill sources and expected Codex MCP/plugin inventory.
- `scripts/bootstrap-agent-skills.ts` installs manifest-managed skills.
- `scripts/doctor-agent-setup.ts` reports drift in installed skills and documented Codex setup.
- `scripts/update-agent-skills.ts` updates all global skills and refreshes well-known skills that the `skills` CLI cannot auto-update.
- `docs/codex-setup.md` documents Codex MCPs/plugins without storing auth or rewriting `~/.codex/config.toml`.

Use `pnpm run doctor` instead of `pnpm doctor`; `pnpm doctor` is a pnpm builtin command.

Private/auth state is intentionally unmanaged: SSH, cloud auth, MCP tokens, Codex auth, logs, caches, memories, and marketplace cache contents stay local.
