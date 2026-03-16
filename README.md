# Agent Skills

A collection of distributable skills for AI coding agents.

This repository is structured for compatibility with the [skills](https://github.com/vercel-labs/skills) CLI and follows the [Agent Skills](https://agentskills.io/) standard.

## Available Skills

### fast-algorithm-exploration-loop

Benchmark-driven workflow for converging on algorithms through small implementation spikes, fuzzing, visual diagnostics, and spec refinement.

**Use when:**
- exploring algorithms, numerical methods, geometry, graphs, optimization, or data structures
- multiple approaches are plausible and need empirical comparison
- success depends on measurable properties such as correctness, error, runtime, memory, or robustness

### long-horizon-codex

Structure and run multi-hour Codex work with four control-plane documents: `prompt.md`, `plans.md`, `implement.md`, and `documentation.md`.

**Use when:**
- Scaffolding a repo for a long-running implementation effort
- Keeping multi-session work coherent across context compaction or handoff
- Creating durable execution plans and validation checkpoints

Inspired by [Run long horizon tasks with Codex](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex)

## Installation

Install the full collection from GitHub:

```bash
 npx skills add phildionne/agent-skills
```

Install a single skill from the repository:

```bash
 npx skills add phildionne/agent-skills --skill long-horizon-codex
```

## Repository Structure

- `skills/<skill-name>/SKILL.md` contains the skill definition
- `skills/<skill-name>/agents/openai.yaml` contains UI metadata when needed
- `skills/<skill-name>/scripts/` contains executable helpers
- `skills/<skill-name>/references/` contains load-on-demand documentation
- `skills/<skill-name>/assets/` contains templates and other output resources
- `skills/<skill-name>.zip` is the packaged distribution artifact
