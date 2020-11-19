import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'

const VersionInput = 'version'
const ChannelInput = 'channel'
const toolName = 'k3sup'

export class K3supConfig {
  version: string
  channel: string
  constructor(version: string, channel: string) {
    this.version = version
    this.channel = channel
  }

  exportKubeconfigAsGithubEnv(): void {
    core.exportVariable('KUBECONFIG', './kubeconfig')
  }

  createCluster(channel: string): void {
    const options = {}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    options.silent = true

    const clusterArgs: string[] = [
      'install',
      '--local',
      '--k3s-channel',
      channel
    ]
    exec.exec('k3sup', clusterArgs, options)
  }
}

export function getK3supConfig(): K3supConfig {
  const v: string = core.getInput(VersionInput)
  const channel: string = core.getInput(ChannelInput)
  return new K3supConfig(v, channel)
}

// this action should always be run from a Linux worker
export async function downloadK3sup(version: string): Promise<string> {
  const url = `https://github.com/alexellis/k3sup/releases/download/${version}/k3sup`
  // eslint-disable-next-line no-console
  console.log(`downloading ${toolName} from ${url}`)
  let downloadPath: string | null = null
  downloadPath = await tc.downloadTool(url)
  await exec.exec('chmod', ['+x', downloadPath])
  const toolPath: string = await tc.cacheFile(
    downloadPath,
    'k3sup',
    toolName,
    version
  )
  core.debug(`${toolName} is cached under ${toolPath}`)

  return toolPath
}

export async function getK3sup(version: string): Promise<string> {
  let toolPath: string = tc.find(toolName, version)

  if (toolPath === '') {
    toolPath = await downloadK3sup(version)
  }

  return toolPath
}
