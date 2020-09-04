import { FileMedia, BaseFileMedia } from '.'

export interface Document extends BaseFileMedia {
  type: 'Document'
}

export class DocumentMedia extends FileMedia<Document, 'Document'> {}
