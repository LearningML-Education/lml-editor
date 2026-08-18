---
name: release-manager
description: Create and publish releases by validating tests, updating the project version, editing CHANGELOG.md, committing the release, pushing main, creating a matching git tag prefixed with v on the published main commit, and pushing that tag to LearningML-Education/lml-editor (the repo that actually deploys) to trigger deployment. Use when the user asks things like "crea la release v2.0.1" or "crea una nueva release" for this project.
---

# Release Manager

Follow this workflow to create a release for the LearningML editor.

## Target repository

Releases are published from **`LearningML-Education/lml-editor`**
(`git@github.com:LearningML-Education/lml-editor.git`), not `lml-editor-lit`. `lml-editor` is
the reference repo: it holds the source directly and its own
`.github/workflows/deploy.yml` builds and deploys to GitHub Pages when a matching tag is
pushed to it. `lml-editor-lit` is a legacy repo being phased out (its
`dispatch-public-deploy.yml` no longer has any effect — nothing listens for the
`repository_dispatch` it sends).

Do the release work (version bump, changelog, tests, commit, tag) in a checkout of
`lml-editor`, not `lml-editor-lit`. If the current working tree is `lml-editor-lit`, clone or
add a remote for `lml-editor` and operate there instead — the tagged commit must exist on
`lml-editor` for the deploy pipeline to see it.

## Deployment trigger

`lml-editor`'s `deploy.yml` only triggers on tags matching the exact pattern
`v[0-9]+.[0-9]+.[0-9]+` (e.g. `v2.0.1`). Tags that don't match this exactly — pre-release
suffixes like `v2.0.1-beta1`, `v2.0.1-rc1`, or non-version tags like `latest` — will **not**
trigger a deployment. Always use a plain `vX.Y.Z` tag for an actual release.

## Inputs

- If the user gives an explicit version such as `v2.0.1`, use it.
- If the user asks for "una nueva release" without a version, determine the target version with the user before editing files or creating tags.
- Treat the git tag as `vX.Y.Z`.
- Treat `package.json` version as `X.Y.Z` without the `v` prefix.

## Release Workflow

1. Inspect the working tree of the `lml-editor` checkout before changing anything.
2. If there are unrelated uncommitted changes, stop and ask the user how to proceed.
3. Run the project's test suite.
4. Update `package.json` so `version` matches the requested release number without `v`.
5. Update `CHANGELOG.md` with a new top entry for `vX.Y.Z` that matches the repository style.
6. Re-run the relevant tests if the release edits changed tracked files.
7. Create a dedicated commit for the release changes if `package.json` or `CHANGELOG.md` were modified and not already committed.
8. Push the release commit to `lml-editor`'s `main`.
9. Verify that the commit to be tagged is already present on `lml-editor`'s `main`.
10. Create an annotated git tag named `vX.Y.Z` (matching `v[0-9]+.[0-9]+.[0-9]+`) on that published commit.
11. Push the tag to `lml-editor` so the deployment pipeline starts.
12. Report the exact commit and tag pushed, and that they were pushed to `lml-editor`.

## Test Policy

- Run `bun run test` at minimum.
- Run `bun run test:e2e` as part of "todos los test" when the environment supports Playwright.
- If Playwright cannot run because browsers or environment dependencies are missing, stop and tell the user before creating the tag.
- Do not create or push a release tag if any required test fails.

## File Checks

- `package.json`: `version` must equal `X.Y.Z`.
- `CHANGELOG.md`: top release heading must be `## [vX.Y.Z]`.
- The tag name must exactly match the changelog heading version.
- The tagged commit must already exist on `lml-editor`'s `main`.
- The tag name must match `v[0-9]+.[0-9]+.[0-9]+` exactly, or `deploy.yml` will not trigger.

## Git Rules

- Do not move or recreate an existing release tag unless the user explicitly asks.
- Prefer annotated tags.
- Push `main` before creating the release tag.
- Push only the intended release tag, not all tags.
- If the release commit is required, make sure the tag points to the published release commit on `lml-editor`'s `main`, not to a dirty working tree state or a local-only commit.

## Output

At the end, provide:

- release version
- tests executed
- commit SHA used for the release
- tag name created
- whether the tag push succeeded
