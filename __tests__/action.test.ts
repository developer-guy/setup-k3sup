import {K3supConfig, getK3supConfig} from '../src/k3sup'

const testEnvVars = {
  INPUT_VERSION: '0.9.11'
}

describe('checking input parsing', function () {
  beforeEach(() => {
    for (const key in testEnvVars)
      process.env[key] = testEnvVars[key as keyof typeof testEnvVars]
  })

  it('correctly parse input', () => {
    const cfg: K3supConfig = getK3supConfig()
    expect(cfg.version).toBe(testEnvVars.INPUT_VERSION)
  })
})
