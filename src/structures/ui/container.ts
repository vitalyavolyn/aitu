import { CustomContainer } from '.'

export class Container {
  public constructor (public content: CustomContainer[]) {}

  public toJSON (): string {
    return JSON.stringify(this.content)
  }
}

export type ContainerMessage = string | Container
