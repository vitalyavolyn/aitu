import { FileMedia } from './index'
import { Music } from '../../interfaces'
import { pickProperties } from '../../utils'

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
