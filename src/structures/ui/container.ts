import { CustomContainer } from '.'

export type ContainerMessage = string | Container

export class Container {
  public constructor (public content: CustomContainer[]) {}

  public toJSON (): ContainerMessage {
    return JSON.stringify(this.content)
  }
}
