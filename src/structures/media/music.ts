import { FileMedia, BaseFileMedia } from '.'
import { pickProperties } from '../../utils'

export interface MusicPayload extends BaseFileMedia {
  type: 'Music'
  duration: number
}

export class MusicMedia extends FileMedia<MusicPayload, 'Music'> {
  public get duration (): number {
    return this.payload.duration
  }

  public serialize (): Record<string, unknown> {
    return {
      ...super.serialize(),
      ...pickProperties(this, [
        'duration'
      ])
    }
  }
}
