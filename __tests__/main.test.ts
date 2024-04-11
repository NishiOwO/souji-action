/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
// const timeRegex = /^\d{2}:\d{2}:\d{2}/

// Mock the GitHub Actions core library
// let debugMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getBooleanInputMock: jest.SpyInstance
// let setFailedMock: jest.SpyInstance
// let setOutputMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getBooleanInputMock = jest
      .spyOn(core, 'getBooleanInput')
      .mockImplementation()
    // setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    // setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('sets the dry-run', async () => {
    // Set the action's inputs as return values from core.getBooleanInput()
    getBooleanInputMock.mockImplementation((name: string): boolean => {
      switch (name) {
        case 'dry-run':
          return true
        default:
          return false
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(errorMock).not.toHaveBeenCalled()
  })

  it.todo('sets a failed status')
  // Set the action's inputs as return values from core.getInput()
})
