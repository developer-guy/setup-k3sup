import {ArkadeConfig, getArkadeConfig} from '../src/arkade'

const testEnvVars = {
  INPUT_VERSION: '0.6.22'
}

describe('checking input parsing', function () {
  beforeEach(() => {
    for (const key in testEnvVars)
      process.env[key] = testEnvVars[key as keyof typeof testEnvVars]
  })

  it('correctly parse input', () => {
    const cfg: ArkadeConfig = getArkadeConfig()
    expect(cfg.version).toBe(testEnvVars.INPUT_VERSION)
  })
})
