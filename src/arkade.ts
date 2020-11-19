import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'

const VersionInput = 'version'
const toolName = 'arkade'

export class ArkadeConfig {
  version: string
  constructor(version: string) {
    this.version = version
  }
}

export function getArkadeConfig(): ArkadeConfig {
  const v: string = core.getInput(VersionInput)
  return new ArkadeConfig(v)
}

// this action should always be run from a Linux worker
export async function downloadArkade(version: string): Promise<string> {
  const url = `https://github.com/alexellis/arkade/releases/download/${version}/arkade`
  // eslint-disable-next-line no-console
  console.log(`downloading ${toolName} from ${url}`)
  let downloadPath: string | null = null
  downloadPath = await tc.downloadTool(url)
  await exec.exec('chmod', ['+x', downloadPath])
  const toolPath: string = await tc.cacheFile(
    downloadPath,
    'arkade',
    toolName,
    version
  )
  core.debug(`${toolName} is cached under ${toolPath}`)

  return toolPath
}

export async function getArkade(version: string): Promise<string> {
  let toolPath: string = tc.find(toolName, version)

  if (toolPath === '') {
    toolPath = await downloadArkade(version)
  }

  return toolPath
}
