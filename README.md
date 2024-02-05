# Souji Action 🧹

[![GitHub Super-Linter](https://github.com/4m-mazi/souji-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/4m-mazi/souji-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/4m-mazi/souji-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/4m-mazi/souji-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/4m-mazi/souji-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/4m-mazi/souji-action/actions/workflows/codeql-analysis.yml)

Souji Action is a GitHub Action that deletes all GitHub Actions Caches related
to the context of the triggered workflow event, without any configuration
required.

## Why

GitHub Actions Caches have
[branch scope restriction](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#restrictions-for-accessing-a-cache)
in place. This means that there are caches that will never be restored in the
future. This action allows you to easily delete such caches.

## Usage

`actions:write` permission is
[required to delete caches](https://docs.github.com/en/rest/actions/cache?apiVersion=2022-11-28#delete-a-github-actions-cache-for-a-repository-using-a-cache-id).

```yml
name: cleanup caches by a branch
on:
  pull_request_target:
    types:
      - closed
  delete:

jobs:
  cleanup:
    runs-on: ubuntu-latest
    permissions:
      actions: write
    steps:
      - name: Cleanup
        uses: 4m-mazi/souji-action@v1 # Check and specify the latest version
```

This workflow cleans up caches for branches when they are merged(closed) or
deleted. \
This will clear the following cache:

- merge ref `refs/pull/<number>/merge`
  - When a pull request is merged or closed, this workflow removes cached data
    associated with the merge ref.
- branch `<branch name>`
  - When a branch is deleted, this workflow deletes the cached data associated
    with the branch.

## Supported events

> [!IMPORTANT]\
> The branch(ref) to be deleted is determined by the context of the event.\
> Please note that this is not the same as `$GITHUB_REF`(`github.ref`).

| event                         | branch name format of caches to be deleted |
| :---------------------------- | :----------------------------------------- |
| `check_run`                   | `<branch name>`                            |
| `check_suite`                 | `<branch name>`                            |
| `create` (branch)             | `<branch name>`                            |
| `create` (tag)                | `refs/tags/<tag name>`                     |
| `delete` (branch)             | `<branch name>`                            |
| `delete` (tag)                | `refs/tags/<tag name>`                     |
| `deployment_status`           | `<branch name>`                            |
| `issue_comment` [^1]          | `refs/pull/<number>/merge`                 |
| `pull_request` [^2]           | `refs/pull/<number>/merge`                 |
| `pull_request_review`         | `refs/pull/<number>/merge`                 |
| `pull_request_review_comment` | `refs/pull/<number>/merge`                 |
| `pull_request_target`         | `refs/pull/<number>/merge`                 |
| `push` (branch)               | `<branch name>`                            |
| `push` (tag)                  | `refs/tags/<tag name>`                     |
| `registry_package`            | `refs/tags/<tag name>`                     |
| `release`                     | `refs/tags/<tag name>`                     |
| `workflow_dispatch` (branch)  | `<branch name>`                            |
| `workflow_dispatch` (tag)     | `refs/tags/<tag name>`                     |
| `workflow_run`                | `<branch name>`                            |

[^1]: Only works with pull request comments.
[^2]:
    This action doesn't work when triggered by a `pull_request` event if the
    pull request is a cross-repository pull request.\
    Therefore, it is recommended to use the `pull_request_target` event instead.
