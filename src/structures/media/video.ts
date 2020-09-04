import { FileMedia } from '.'
import { Video } from '../../interfaces'
import { pickProperties } from '../../utils'

export class VideoMedia extends FileMedia<Video, 'Video'> {
  public get width (): number {
    return this.payload.width
  }

  public get height (): number {
    return this.payload.height
  }

  public get duration (): number {
    return this.payload.duration
  }

  public serialize (): Record<string, unknown> {
    return {
      ...super.serialize(),
      ...pickProperties(this, [
        'width',
        'height',
        'duration'
      ])
    }
  }
}
