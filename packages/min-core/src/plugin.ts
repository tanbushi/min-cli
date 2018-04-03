import loader from './loader'
import util from './util'

export class PluginHelper {
  plugins: PluginHelper.Plugin[] = []

  constructor (type: PluginHelper.Type, name?: string | string[]) {
    let names: string[] = []

    if (!util.isUndefined(name)) {
      names = util.isString(name) ? [name] : name
    }

    names.forEach(name => {
      let plugin = loader.getPlugin(name)

      if (plugin && plugin.type === type) {
        this.plugins.push(plugin)
      }
    })

    if (!names.length) {
      this.plugins = [ ...this.plugins, ...loader.getPlugins(type) ]
    }
  }

  get isCanUse () {
    return this.plugins.length > 0
  }

  async apply (options: PluginHelper.Options) {
    let p

    try {
      for (const plugin of this.plugins) {
        options = await plugin.apply(options)
      }
      p = Promise.resolve(options)
    }
    catch (err) {
      p = Promise.reject(err)
    }

    return p
  }

  applySync (options: PluginHelper.Options, callback: Function) {
    try {
      (async () => {
        for (const plugin of this.plugins) {
          options = await plugin.apply(options)
        }
        callback(null, options)
      })()
    }
    catch (err) {
      callback(err)
    }
  }
}

export namespace PluginHelper {

  export interface Options {
    cwd: string // Current working directory
    filename: string // Relative path to the current working directory.
    src?: string // source path
    dest?: string // dist path
    extend?: {
      content?: string // file content
      ast?: any // for babel postcss htmlparse
      requirePath?: string // for sdk
      watch?: boolean
      buffer?: Buffer
    }
  }

  export enum Type {
    Text = 'Text',
    File = 'File',
    Ast = 'Ast',
    Image = 'Image',
    Sdk = 'Sdk'
  }

  export type Plugin = TextPlugin | FilePlugin | SdkPlugin | AstPlugin | ImagePlugin

  export interface BasePlugin {
    type: Type
    name: string
    apply (options: Options): Promise<Options>
  }

  export class FilePlugin implements BasePlugin {
    type: PluginHelper.Type = PluginHelper.Type.File
    constructor (public name: string) {}
    apply (options: Options): Promise<Options> {
      throw new Error('Method not implemented.')
    }
  }

  export class TextPlugin implements BasePlugin {
    type: PluginHelper.Type = PluginHelper.Type.Text
    constructor (public name: string) {}
    apply (options: Options): Promise<Options> {
      throw new Error('Method not implemented.')
    }
  }

  export class SdkPlugin implements BasePlugin {
    type: PluginHelper.Type = PluginHelper.Type.Sdk
    constructor (public name: string) {}
    apply (options: Options): Promise<Options> {
      throw new Error('Method not implemented.')
    }
  }

  export class AstPlugin implements BasePlugin {
    type: PluginHelper.Type = PluginHelper.Type.Ast
    constructor (public name: string) {}
    apply (options: Options): Promise<Options> {
      throw new Error('Method not implemented.')
    }
  }

  export class ImagePlugin implements BasePlugin {
    type: PluginHelper.Type = PluginHelper.Type.Image
    constructor (public name: string) {}
    apply (options: Options): Promise<Options> {
      throw new Error('Method not implemented.')
    }
  }
}
