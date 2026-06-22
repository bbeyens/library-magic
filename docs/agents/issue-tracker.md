# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all issue-tracker operations.

## Current repo state

This repo is configured to use GitHub Issues, but it currently has no Git remote. Once a GitHub remote is added, `gh` will infer the repo automatically when run inside this clone. Until then, pass `-R owner/repo` to `gh` commands.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` when a GitHub remote exists. If there is no remote, use `gh -R owner/repo ...`.

## Pull requests as a triage surface

**PRs as a request surface: no.**

Leave this off unless this repo treats external PRs as feature requests. If it is turned on later, PRs should run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE`.
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label` / `--remove-label`, `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either. Resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.
