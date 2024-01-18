import * as core from '@actions/core'
import * as github from '@actions/github'
import * as v from 'valibot'

const OptionalStringSchema = v.optional(v.string())

const deleteRefActionsCache = async (
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
    for (const { id: cacheId } of cacheList) {
      if (!cacheId) continue
      await octokit.rest.actions.deleteActionsCacheById({
        ...repo,
        cache_id: cacheId
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
    const { repo } = github.context

    // MEMO: payloadから取得できるのは確認したけど、型何もついてない
    const payload = github.context.payload
    const prNumber = payload.pull_request?.number
    const headRef = v.parse(
      OptionalStringSchema,
      payload.pull_request?.head?.ref
    )
    const ref = v.parse(OptionalStringSchema, payload.ref)

    if (prNumber) {
      // fire when event is pull_request or pull_request_target or pull_request_review or pull_request_review_comment
      core.info(`delete cache for refs/pull/${prNumber}/merge`)
      await deleteRefActionsCache(octokit, repo, `refs/pull/${prNumber}/merge`)
      core.info('done ✅')
    }
    if (headRef) {
      // fire when event is pull_request or pull_request_target or pull_request_review or pull_request_review_comment
      core.info(`delete cache for refs/heads/${headRef}`)
      await deleteRefActionsCache(octokit, repo, `refs/heads/${headRef}`)
      core.info('done ✅')
    }
    if (ref) {
      // fire when event is workflow_dispatch or push
      core.info(`delete cache for ${ref}`)
      await deleteRefActionsCache(octokit, repo, ref)
      core.info('done ✅')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
