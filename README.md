# Agent Skills

A collection of distributable skills for AI coding agents.

This repository is structured for compatibility with the [skills](https://github.com/vercel-labs/skills) CLI and follows the [Agent Skills](https://agentskills.io/) standard.

## Installation

Install the full collection from GitHub:

```bash
 npx skills add phildionne/agent-skills
```


## Repository Structure

- `skills/<skill-name>/SKILL.md` contains the skill definition
- `skills/<skill-name>/agents/openai.yaml` contains UI metadata when needed
- `skills/<skill-name>/scripts/` contains executable helpers
- `skills/<skill-name>/references/` contains load-on-demand documentation
- `skills/<skill-name>/assets/` contains templates and other output resources
- `skills/<skill-name>.zip` is the packaged distribution artifact
