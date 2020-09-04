import { FileMedia, BaseFileMedia } from '.'
import { pickProperties } from '../../utils'

export interface Music extends BaseFileMedia {
  type: 'Music'
  duration: number
}

export class MusicMedia extends FileMedia<Music, 'Music'> {
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
