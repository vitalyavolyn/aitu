import { FileMedia, BaseFileMedia } from '.'

export interface DocumentPayload extends BaseFileMedia {
  type: 'Document'
}

export class DocumentMedia extends FileMedia<DocumentPayload, 'Document'> {}
