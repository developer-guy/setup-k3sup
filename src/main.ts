import * as core from '@actions/core'
import {K3supConfig, getK3sup, getK3supConfig} from './k3sup'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function run() {
  try {
    const cfg: K3supConfig = getK3supConfig()
    const toolPath: string = await getK3sup(cfg.version)
    core.addPath(toolPath)
    cfg.createCluster(cfg.channel)
    cfg.exportKubeconfigAsGithubEnv()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
