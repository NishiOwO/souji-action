# Souji Action 🧹

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)

Souji Action is a GitHub Action that deletes all GitHub Actions Caches related
to the context of the triggered workflow event, without any configuration
required.

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
