import { inspectable } from 'inspectable'

import { Aitu } from '../aitu'
import { AllowArray, UpdateType } from '../types'
import { Update } from '../interfaces'

export interface ContextOptions<
  P extends Update = Update,
> {
  aitu: Aitu
  payload: P
}

export class Context<P extends Update = Update> {
  public type: UpdateType
  public payload: P
  protected aitu: Aitu

  // TODO: add optional stateType parameter?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: Record<string, any> = {}

  public constructor (options: ContextOptions<P>) {
    this.aitu = options.aitu
    this.payload = options.payload
    this.type = options.payload.type
  }

  public get [Symbol.toStringTag] (): string {
    return this.constructor.name
  }

  public get updateId (): string {
    return this.payload.updateId
  }

  public is (rawTypes: AllowArray<string>): boolean {
    const types = Array.isArray(rawTypes)
      ? rawTypes
      : [rawTypes]

    return types.includes(this.type)
  }

  public toJSON (): Record<string, unknown> {
    return {
      ...this.serialize(),
      type: this.type,
      state: this.state
    }
  }

  public serialize (): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { aitu, ...rest } = this
    return rest
  }
}

inspectable(Context, {
  serialize: instance => instance.toJSON(),
  stringify: (instance, payload, context): string => (
    `${context.stylize(instance.constructor.name, 'special')} ${context.inspect(payload)}`
  )
})
