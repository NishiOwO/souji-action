import * as core from '@actions/core'
import * as github from '@actions/github'
import { getRef } from './ref'
import type * as types from '@octokit/openapi-types'
import { getInputs } from './get-inputs'

type Cache =
  types.components['schemas']['actions-cache-list']['actions_caches'][number]

const ansi = { reset: '\x1B[0m', dryRun: '\x1B[38;2;90;185;255m' }

const prefix = ({ isDryRun = false }: { isDryRun: boolean }): string =>
  isDryRun ? `${ansi.dryRun}DRY-RUN MODE ${ansi.reset}` : ''

const deleteRefActionsCaches = async (
  octokit: ReturnType<typeof github.getOctokit>,
  repo: { owner: string; repo: string },
  ref: string,
  isDryRun: boolean
): Promise<void> => {
  const deleteCache = async (cache: Cache): Promise<void> => {
    if (!cache.id) return
    core.info(`${prefix({ isDryRun })}   - Cache with key ${cache.key}`)
    if (!isDryRun) {
      await octokit.rest.actions.deleteActionsCacheById({
        ...repo,
        cache_id: cache.id
      })
    }
  }

  // https://github.com/octokit/plugin-paginate-rest.js#octokitpaginate
  const caches = await octokit.paginate(
    octokit.rest.actions.getActionsCacheList,
    {
      ...repo,
      ref,
      per_page: 100
    }
  )
  core.info(
    `${prefix({ isDryRun })}⌛ Deleting ${caches.length} cache(s) on ${ref}`
  )

  await Promise.all(caches.map(async cache => deleteCache(cache)))
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const { token, dryRun: isDryRun } = getInputs()
    const octokit = github.getOctokit(token)

    // get repostiory information
    const { repo, eventName, payload } = github.context

    const ref = getRef({ eventName, payload })
    if (ref === null) {
      core.info('🤔 Could not determine deletion target.')
      core.info(
        'ℹ️ If you suspect this is a bug, please consider raising an issue to help us address it promptly.'
      )
      return
    }
    await deleteRefActionsCaches(octokit, repo, ref, isDryRun)

    core.info(`${prefix({ isDryRun })}✅ Done`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
      core.info(
        'ℹ️ If you suspect this is a bug, please consider raising an issue to help us address it promptly.'
      )
    }
  }
}
