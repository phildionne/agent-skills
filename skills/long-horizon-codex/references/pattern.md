# Long-Horizon Codex Pattern

## Extracted pattern

Keep a long-running task anchored in a small set of durable files that survive compaction and make resumption cheap.

## Source material

- Blog post: https://developers.openai.com/blog/run-long-horizon-tasks-with-codex
- Example prompt file: https://github.com/derrickchoi-openai/design-desk/blob/main/docs/prompt.md
- Example plan file: https://github.com/derrickchoi-openai/design-desk/blob/main/docs/plans.md
- Example execution file: https://github.com/derrickchoi-openai/design-desk/blob/main/docs/implement.md
- Example documentation file: https://github.com/derrickchoi-openai/design-desk/blob/main/docs/documentation.md

## Extracted pattern

The blog's core move is to keep a long-running task anchored in a small set of durable files that survive compaction and make resumption cheap.

The example uses four files:

1. `prompt.md`
   The mission brief. It sets the role, the product or engineering target, the constraints, the deliverables, and the directive to plan before coding.

2. `plans.md`
   The execution source of truth. It holds milestones, validation gates, the risk register, the demo flow, architecture notes, and the running decision log.

3. `implement.md`
   The execution contract. It tells Codex to proceed through milestones without stalling for confirmation, to validate after each milestone, and to keep docs synchronized with reality.

4. `documentation.md`
   The operator runbook. It captures setup, verification, demo flows, repo structure, data format notes, and troubleshooting.

## Skill-specific wording to preserve

Keep these directive styles when adapting the pattern:

- Use direct imperative language.
- Make `plans.md` authoritative.
- Require verification at every milestone.
- Make determinism or correctness explicit when the work demands it.
- Tell Codex not to stop for confirmation when the task is clearly scoped and execution should continue.
- Require the docs to evolve with the implementation rather than staying aspirational.

## What to vary per project

- The concrete product or engineering spec in `prompt.md`
- The milestone breakdown in `plans.md`
- The exact verification commands
- The completion criteria in `implement.md`
- The operator instructions in `documentation.md`

## What to keep stable

- The four-file shape
- Planning before implementation
- Milestone-based execution
- Continuous validation
- Continuous doc maintenance
- A final verification sweep before declaring completion
