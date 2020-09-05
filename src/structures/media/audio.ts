import { FileMedia, BaseFileMedia } from '.'

export interface AudioPayload extends BaseFileMedia {
  type: 'Audio'
}

export class AudioMedia extends FileMedia<AudioPayload, 'Audio'> {}
