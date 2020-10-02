import { LastAction, Scene, StepContext } from '.'
import { StepSceneContext } from './step-context'

export type StepSceneHandler<T = {}> = (context: StepContext & T) => unknown

export interface StepSceneOptions {
  steps: StepSceneHandler[]
  enterHandler?: StepSceneHandler
  leaveHandler?: StepSceneHandler
}

export class StepScene implements Scene {
  public slug: string
  public steps: StepSceneHandler[]

  private onEnterHandler: NonNullable<StepSceneOptions['enterHandler']>;
  private onLeaveHandler: NonNullable<StepSceneOptions['leaveHandler']>;

  public constructor (slug: string, rawOptions: StepSceneOptions | StepSceneHandler[]) {
    const options = Array.isArray(rawOptions)
      ? { steps: rawOptions }
      : rawOptions

    this.slug = slug

    this.steps = options.steps

    this.onEnterHandler = options.enterHandler || ((): void => {})
    this.onLeaveHandler = options.leaveHandler || ((): void => {})
  }

  public async enterHandler (context: StepContext): Promise<void> {
    context.scene.step = new StepSceneContext({
      context,
      steps: this.steps
    })

    await this.onEnterHandler(context)

    if (context.scene.lastAction !== LastAction.LEAVE) {
      await context.scene.step.reenter()
    }
  }

  public leaveHandler (context: StepContext): Promise<unknown> {
    return Promise.resolve(this.onLeaveHandler(context))
  }
}
