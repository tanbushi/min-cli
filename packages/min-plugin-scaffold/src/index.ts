import { util, PluginHelper } from '@mindev/min-core'

const DEFAULTS: ScaffoldPlugin.Options = {
  config: {},
  filter: new RegExp('\.(ext)$'),
  validate (options: PluginHelper.Options) {
    return true
  }
}

export namespace ScaffoldPlugin {
  export interface Config {}

  export interface Options {
    config: Config
    filter: RegExp
    validate (options: PluginHelper.Options): boolean
  }
}

export default class ScaffoldPlugin extends PluginHelper.TextPlugin {

  constructor (public options: ScaffoldPlugin.Options) {
    super('ScaffoldPlugin')

    this.options = {
      ...DEFAULTS,
      ...this.options
    }
  }

  async apply (options: PluginHelper.Options): Promise<PluginHelper.Options> {
    let { filter, validate, config } = this.options
    let { filename, extend } = options
    let p = Promise.resolve(options)

    if (util.isRegExp(filter) && !filter.test(filename)) {
      return p
    }

    if (util.isFunction(validate) && !validate(options)) {
      return p
    }

    try {
      util.merge(options, { extend: { } })
    }
    catch (err) {
      p = Promise.reject(err)
    }

    return p
  }
}
