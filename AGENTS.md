# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Repository Overview

A collection of distributable skills for AI coding agents. The repository is intended to work as a clonable source repo and as an install target for the `skills` CLI.

## Creating or Updating a Skill

### Directory Structure

```text
skills/
  {skill-name}/           # kebab-case directory name
    SKILL.md              # Required: skill definition
    agents/               # Optional: UI metadata
      openai.yaml
    scripts/              # Optional: executable helpers
    references/           # Optional: supporting docs
    assets/               # Optional: templates or other output assets
  {skill-name}.zip        # Optional but recommended: packaged for distribution
```

### Naming Conventions

- Skill directory: `kebab-case`
- `SKILL.md`: always uppercase, always this exact filename
- Scripts: prefer descriptive `snake_case.py` or `kebab-case.sh`, matching the runtime already used by the skill
- Zip file: must match the directory name exactly: `{skill-name}.zip`

### Skill Expectations

- Keep `SKILL.md` concise and focused on workflow guidance.
- Move detailed material into `references/` and link to it from `SKILL.md`.
- Put reusable templates and generated-output scaffolds in `assets/`.
- Keep helper automation in `scripts/` when deterministic execution is useful.
- Regenerate the sibling zip after materially changing a packaged skill.
- Keep the top-level repo compatible with `npx skills add <owner/repo>` by ensuring skills live directly under `skills/`.

### Packaging

From the repo root:

```bash
cd skills
zip -r {skill-name}.zip {skill-name}/
```

### Installation

Repository collections should be installable with:

```bash
npx skills add {owner}/{repo}
```

Single skills should also be installable with:

```bash
npx skills add {owner}/{repo} --skill {skill-name}
```
