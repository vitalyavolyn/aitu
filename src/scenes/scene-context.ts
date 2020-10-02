import { Context } from '..'
import { Scene } from '.'

export type SceneExtended<T extends Context = Context> = T & {
  scene: SceneContext

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface SceneContextOptions {
  context: SceneExtended
  repository: Map<string, Scene>
}

export enum LastAction {
  NONE = 'none',
  ENTER = 'enter',
  LEAVE = 'leave'
}

export interface SceneContextEnterOptions {
  /**
   * Entering into a handler without executing it
   */
  silent?: boolean

  /**
   * The state for the scene
   */
  state?: Record<string, unknown>
}

export interface SceneContextLeaveOptions {
  /**
   * Logging into a handler without executing it
   */
  silent?: boolean

  /**
   * Is scene execution canceled?
   */
  canceled?: boolean
}

export class SceneContext {
  /** Session for submodules */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public session!: Record<string, any>

  /**
   * Base namespace for user input
   *
   * @example
   * ctx.scene.state.username = ctx.text
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state!: Record<string, any>

  /**
   * Is the scene canceled, used in leaveHandler()
   *
   * @example
   * ctx.scene.leave({
   *   canceled: true
   * })
   */
  public canceled = false

  public lastAction: LastAction = LastAction.NONE
  public leaving = false

  private context: SceneExtended
  private repository: Map<string, Scene>

  public constructor (options: SceneContextOptions) {
    this.context = options.context
    this.repository = options.repository
    this.updateSession()
  }

  /**
   * Returns current scene
   */
  public get current (): Scene | undefined {
    return this.repository.get(this.session.current)
  }

  /**
   * Enter the scene
   *
   * @example
   * ctx.scene.enter('signup')
   * ctx.scene.enter('signup', {
   *   silent: true,
   *   state: {
   *     username: 'Super_Developer'
   *   }
   * })
   */
  public async enter (slug: string, options: SceneContextEnterOptions = {}): Promise<void> {
    const scene = this.repository.get(slug)

    if (!scene) throw new Error('No scene with name ' + slug)

    const isCurrent = this.current?.slug === scene.slug

    if (!isCurrent) {
      if (!this.leaving) {
        await this.leave({
          silent: options.silent
        })
      }

      if (this.leaving) {
        this.leaving = false

        this.reset()
      }
    }

    this.lastAction = LastAction.ENTER

    this.session.current = scene.slug
    Object.assign(this.state, options.state || {})

    if (options.silent) {
      return
    }

    await scene.enterHandler(this.context)
  }

  /**
   * Reenter the current scene
   *
   * @example
   * ctx.scene.reenter()
   */
  public async reenter (): Promise<void> {
    const { current } = this

    if (!current) {
      throw new Error('There is no active scene to enter')
    }

    await this.enter(current.slug)
  }

  /**
   * Leave current scene
   *
   * @example
   * ctx.scene.leave()
   * ctx.scene.leave({
   *   silent: true,
   *   canceled: true
   * })
   */
  public async leave (options: SceneContextLeaveOptions = {}): Promise<void> {
    const { current } = this

    if (!current) {
      return
    }

    this.leaving = true
    this.lastAction = LastAction.LEAVE

    if (!options.silent) {
      this.canceled = options.canceled ?? false

      await current.leaveHandler(this.context)
    }

    if (this.leaving) {
      this.reset()
    }

    this.leaving = false
    this.canceled = false
  }

  /**
   * Reset state/session
   */
  public reset (): void {
    delete this.context.session._scene
    this.updateSession()
  }

  private updateSession () {
    this.session = new Proxy(this.context.session._scene || {}, {
      set: (target, prop, value): boolean => {
        target[prop] = value
        this.context.session._scene = target
        return true
      }
    })

    this.state = new Proxy(this.session.state || {}, {
      set: (target, prop, value): boolean => {
        target[prop] = value

        this.session.state = target

        return true
      }
    })
  }
}
