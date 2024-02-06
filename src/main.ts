import * as core from '@actions/core'
import * as github from '@actions/github'
import { getRef } from './ref'
import type * as types from '@octokit/openapi-types'

type Cache =
  types.components['schemas']['actions-cache-list']['actions_caches'][number]

const deleteRefActionsCaches = async (
  octokit: ReturnType<typeof github.getOctokit>,
  repo: { owner: string; repo: string },
  ref: string
): Promise<void> => {
  const deleteCache = async (cache: Cache): Promise<void> => {
    if (!cache.id) return
    core.info(`   - Cache with key ${cache.key}`)
    await octokit.rest.actions.deleteActionsCacheById({
      ...repo,
      cache_id: cache.id
    })
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

  await Promise.all(caches.map(async cache => deleteCache(cache)))
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token')
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
    core.info(`⌛ Deleting caches on ${ref}`)
    await deleteRefActionsCaches(octokit, repo, ref)
    core.info('✅ Done')
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
