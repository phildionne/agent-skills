# Agent Skills

A collection of distributable skills for AI coding agents.

This repository is structured for compatibility with the `skills` CLI and follows the standard `skills/<skill-name>/SKILL.md` layout used by installable skill collections.

## Available Skills

### long-horizon-codex

Structure and run multi-hour Codex work with four control-plane documents: `prompt.md`, `plans.md`, `implement.md`, and `documentation.md`.

**Use when:**
- Scaffolding a repo for a long-running implementation effort
- Keeping multi-session work coherent across context compaction or handoff
- Creating durable execution plans and validation checkpoints

## Installation

Install the full collection from GitHub:

```bash
npx skills add pdionne/agent-skills
```

Install a single skill from the repository:

```bash
npx skills add pdionne/agent-skills --skill long-horizon-codex
```

## Repository Structure

- `skills/<skill-name>/SKILL.md` contains the skill definition
- `skills/<skill-name>/agents/openai.yaml` contains UI metadata when needed
- `skills/<skill-name>/scripts/` contains executable helpers
- `skills/<skill-name>/references/` contains load-on-demand documentation
- `skills/<skill-name>/assets/` contains templates and other output resources
- `skills/<skill-name>.zip` is the packaged distribution artifact

## Development

Clone the repository and edit skills in place:

```bash
git clone https://github.com/pdionne/agent-skills.git
cd agent-skills
```

When a packaged skill changes, rebuild its sibling zip from the `skills/` directory:

```bash
cd skills
zip -r long-horizon-codex.zip long-horizon-codex/
```
