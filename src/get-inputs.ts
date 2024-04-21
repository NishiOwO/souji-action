import * as core from '@actions/core'

export const getInputs = (): {
  token: string
  branchNames: string[]
  dryRun: boolean
} => ({
  token: core.getInput('repo-token', { required: true }),
  branchNames: core
    .getInput('branch-names')
    .split(/\s+/)
    .filter(x => x !== ''),
  dryRun: core.getBooleanInput('dry-run')
})
