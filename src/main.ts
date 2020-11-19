import * as core from '@actions/core'
import {ArkadeConfig, getArkade, getArkadeConfig} from './arkade'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function run() {
  try {
    const cfg: ArkadeConfig = getArkadeConfig()
    const toolPath: string = await getArkade(cfg.version)
    core.addPath(toolPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
