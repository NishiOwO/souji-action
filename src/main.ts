import * as core from '@actions/core'
import * as github from '@actions/github'
import { getRef } from './ref'

const deleteRefActionsCaches = async (
  octokit: ReturnType<typeof github.getOctokit>,
  repo: { owner: string; repo: string },
  ref: string
): Promise<void> => {
  // Get the list of cache IDs
  // https://github.com/octokit/plugin-paginate-rest.js#octokitpaginate
  const iterator = octokit.paginate.iterator(
    octokit.rest.actions.getActionsCacheList,
    {
      ...repo,
      ref
    }
  )

  // https://github.com/octokit/octokit.js/tree/b831b6bce43d56b97e25a996e1b43525486d8bd3?tab=readme-ov-file#pagination
  for await (const { data: cacheList } of iterator) {
    for (const cache of cacheList) {
      if (!cache.id) continue
      core.info(`   - Cache with key ${cache.key}`)
      await octokit.rest.actions.deleteActionsCacheById({
        ...repo,
        cache_id: cache.id
      })
    }
  }
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
