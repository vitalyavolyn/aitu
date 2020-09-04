import { FileMedia, BaseFileMedia } from '.'
import { pickProperties } from '../../utils'

export interface Image extends BaseFileMedia {
  type: 'Image'
  width: number
  height: number
}

export class ImageMedia extends FileMedia<Image, 'Image'> {
  public get width (): number {
    return this.payload.width
  }

  public get height (): number {
    return this.payload.height
  }

  public serialize (): Record<string, unknown> {
    return {
      ...super.serialize(),
      ...pickProperties(this, [
        'width',
        'height'
      ])
    }
  }
}
