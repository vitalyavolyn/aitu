import { FileMedia, BaseFileMedia } from '.'
import { pickProperties } from '../../utils'

export interface VideoPayload extends BaseFileMedia {
  type: 'Video'
  width: number
  height: number
  duration: number
}

export class VideoMedia extends FileMedia<VideoPayload, 'Video'> {
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
