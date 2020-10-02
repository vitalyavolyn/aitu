import { LastAction, SceneContext, SceneExtended, StepSceneHandler } from '.'

export interface StepContext extends SceneExtended {
  scene: SceneContext & {
    step: StepSceneContext
  }
}

export interface StepContextOptions {
  context: StepContext
  steps: StepSceneHandler[]
}

export interface StepContextGoOptions {
  /**
   * Entering into a handler without executing it
   */
  silent?: boolean
}

export class StepSceneContext {
  private context: StepContextOptions['context'];

  private steps: StepContextOptions['steps'];

  private stepChanged = false;

  public constructor (options: StepContextOptions) {
    this.context = options.context

    this.steps = options.steps
  }

  /**
   * The first enter to the handler
   */
  public get firstTime (): boolean {
    const { firstTime = true } = this.context.scene.session

    return firstTime
  }

  /**
   * Returns current stepId
   */
  public get stepId (): number {
    return this.context.scene.session.stepId || 0
  }

  /**
   * Sets current stepId
   */
  public set stepId (stepId: number) {
    const { session } = this.context.scene

    session.stepId = stepId
    session.firstTime = true

    this.stepChanged = true
  }

  /**
   * Returns current handler
   */
  public get current (): StepSceneHandler<{}> | undefined {
    return this.steps[this.stepId]
  }

  /**
   * Reenter current step handler
   */
  public async reenter (): Promise<void> {
    const { current } = this

    if (!current) {
      await this.context.scene.leave()

      return
    }

    this.stepChanged = false

    await current(this.context)

    if (this.context.scene.lastAction !== LastAction.LEAVE && !this.stepChanged) {
      this.context.scene.session.firstTime = false
    }
  }

  /**
   * The go method goes to a specific step
   *
   * @example
   * ctx.scene.step.go(3)
   * ctx.scene.step.go(3, {
   *   silent: true
   * })
   */
  public go (stepId: number, { silent = false }: StepContextGoOptions = {}): Promise<void> {
    this.stepId = stepId

    if (silent) {
      return Promise.resolve()
    }

    return this.reenter()
  }

  /**
   * Move to the next handler
   *
   * @example
   * ctx.scene.step.next()
   * ctx.scene.step.next({
   *   silent: true
   * })
   */
  public next (options?: StepContextGoOptions): Promise<void> {
    return this.go(this.stepId + 1, options)
  }

  /**
   * Move to the previous handler
   *
   * @example
   * ctx.scene.step.previous()
   * ctx.scene.step.previous({
   *   silent: true
   * })
   */
  public previous (options?: StepContextGoOptions): Promise<void> {
    return this.go(this.stepId - 1, options)
  }
}
