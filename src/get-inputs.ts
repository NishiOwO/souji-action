import * as core from '@actions/core'

export const getInputs = (): { token: string; dryRun: boolean } => ({
  token: core.getInput('repo-token', { required: true }),
  dryRun: core.getBooleanInput('dry-run')
})
