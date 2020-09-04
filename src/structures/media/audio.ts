import { FileMedia, BaseFileMedia } from '.'

export interface Audio extends BaseFileMedia {
  type: 'Audio'
}

export class AudioMedia extends FileMedia<Audio, 'Audio'> {}
