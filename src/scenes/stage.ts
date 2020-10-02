import { Middleware } from 'middleware-io'

import { SceneExtended, SceneContext } from '.'

export interface Scene {
  /** Unique scene name */
  slug: string

  /** Enter handler */
  enterHandler(context: SceneExtended): unknown

  /** Leave handler */
  leaveHandler(context: SceneExtended): unknown
}

export class Stage {
  private repository = new Map<string, Scene>()

  public constructor (scenes: Scene[] = []) {
    this.addScenes(scenes)
  }

  /** Returns the middleware for embedding, use after `session()` */
  public get middleware (): Middleware<SceneExtended> {
    return (context: SceneExtended, next) => {
      context.scene = new SceneContext({
        context, repository: this.repository
      })

      return next()
    }
  }

  /** Returns the middleware for intercepting */
  public get sceneMiddleware (): Middleware<SceneExtended> {
    return (context, next): Promise<unknown> => {
      if (!context.scene?.current) {
        return next()
      }

      return context.scene.reenter()
    }
  }

  /** Checks if a scene exists */
  public hasScene (slug: string): boolean {
    return this.repository.has(slug)
  }

  /** Adds scenes to the stage */
  public addScenes (scenes: Scene[]): this {
    for (const scene of scenes) {
      this.repository.set(scene.slug, scene)
    }

    return this
  }
}
