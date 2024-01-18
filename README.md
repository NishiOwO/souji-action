# Souji Action 🧹

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)

Souji Action deletes all GitHub Actions Caches created for branches related to
the context of the triggered workflow event.

## Usage

`actions:write` permission is
[required to delete caches](https://docs.github.com/en/rest/actions/cache?apiVersion=2022-11-28#delete-a-github-actions-cache-for-a-repository-using-a-cache-id).

```yml
on:
  pull_request:
    types:
      - closed

jobs:
  cleanup:
    runs-on: ubuntu-latest
    permissions:
      actions: write
    steps:
      - name: Cleanup
        uses: 4m-mazi/souji-action@v1 # Check and specify the latest version
```

For instance, when a Pull Request created in the branch `feat/awesome-feature`
is "merged" or "closed," a workflow event is triggered and the workflow is
executed. At this time, all GitHub Actions Caches created under the merge ref
`refs/pull/{pull_request_number}/merge` and the head ref
`refs/heads/feat/awesome-feature` are deleted.
