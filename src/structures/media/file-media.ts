import fetch, { Response } from 'node-fetch'
import { Media } from '.'
import { BaseFileMedia, InputMedia } from '../../interfaces'
import { pickProperties } from '../../utils'

export class FileMedia<
  P extends BaseFileMedia, Type extends BaseFileMedia['type'] = BaseFileMedia['type']
> extends Media<P, Type> {
  public get fileId (): string {
    return this.payload.fileId
  }

  public get mimeType (): string {
    return this.payload.mimeType
  }

  public get name (): string {
    return this.payload.name
  }

  public get size (): number {
    return this.payload.size
  }

  private get download (): Promise<Response> {
    const { token, apiBaseUrl } = this.aitu.options

    return fetch(`${apiBaseUrl}/download?fileId=${this.fileId}`, {
      headers: {
        'x-bot-token': token
      }
    })
  }

  public get downloadStream (): Promise<NodeJS.ReadableStream> {
    return this.download.then(response => response.body)
  }

  public get downloadBuffer (): Promise<Buffer> {
    return this.download.then(response => response.buffer())
  }

  public get isSendable (): boolean {
    // TODO: figure out if bot can send more types of media
    return ['Image', 'Video', 'Audio', 'Document'].includes(this.type)
  }

  public toJSON (): InputMedia {
    const mediaType = this.type.toUpperCase() as InputMedia['mediaType']

    return { fileId: this.fileId, mediaType, name: this.name }
  }

  public serialize (): Record<string, unknown> {
    return pickProperties(this, [
      'fileId',
      'mimeType',
      'name',
      'size'
    ])
  }
}
