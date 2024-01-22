import * as v from 'valibot'
import { WebhookPayload } from '@actions/github/lib/interfaces'
import {
  OptionalStringSchema,
  NullableStringSchema,
  StringSchema
} from './schema'
import { convertRef } from './internal/utils'

export const getRef = (({ eventName, payload }) => {
  switch (eventName) {
    case 'check_run':
      return convertRef(
        v.parse(
          NullableStringSchema,
          payload.check_run.check_suite.head_branch
        ),
        { refType: 'branch' }
      )
    case 'check_suite':
      return convertRef(
        v.parse(NullableStringSchema, payload.check_suite.head_branch),
        { refType: 'branch' }
      )
    case 'create':
      return convertRef(v.parse(NullableStringSchema, payload.ref), {
        refType: payload.ref_type
      })
    case 'delete':
      return convertRef(v.parse(NullableStringSchema, payload.ref), {
        refType: payload.ref_type
      })
    case 'deployment_status':
      return convertRef(
        v.parse(OptionalStringSchema, payload.workflow_run?.head_branch),
        {
          refType: 'branch'
        }
      )
    case 'issue_comment':
      return convertRef(
        v.parse(StringSchema, payload.issue?.number.toString()),
        {
          refType: 'pull'
        }
      )
    case 'pull_request':
      return convertRef(payload.pull_request?.number.toString(), {
        refType: 'pull'
      })
    case 'pull_request_review':
      return convertRef(payload.pull_request?.number.toString(), {
        refType: 'pull'
      })
    case 'pull_request_review_comment':
      return convertRef(payload.pull_request?.number.toString(), {
        refType: 'pull'
      })
    case 'pull_request_target':
      return convertRef(payload.pull_request?.number.toString(), {
        refType: 'pull'
      })
    case 'push':
      return v.parse(StringSchema, payload.ref)
    case 'registry_package':
      return convertRef(
        v.parse(
          OptionalStringSchema,
          payload.registry_package?.package_version?.release?.tag_name
        ),
        {
          refType: 'tag'
        }
      )
    case 'release':
      return convertRef(v.parse(StringSchema, payload.release.tag_name), {
        refType: 'tag'
      })
    case 'workflow_dispatch':
      return v.parse(StringSchema, payload.ref)
    case 'workflow_run':
      return convertRef(
        v.parse(NullableStringSchema, payload.workflow_run.head_branch),
        {
          refType: 'branch'
        }
      )
    default:
      throw new Error(`${eventName} event is not supported.`)
  }
}) satisfies ({
  eventName,
  payload
}: {
  eventName: string
  payload: WebhookPayload
}) => string | null
