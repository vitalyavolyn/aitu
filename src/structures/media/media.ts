import { inspectable } from 'inspectable'

import { Aitu } from '../../aitu'
import {
  ImageMedia,
  VideoMedia,
  DocumentMedia,
  AudioMedia,
  ContactMedia,
  GifMedia,
  MusicMedia,

  ImagePayload,
  VideoPayload,
  DocumentPayload,
  AudioPayload,
  RegisteredContactPayload, UnregisteredContactPayload,
  GifPayload,
  MusicPayload
} from '.'
import { Constructor } from '../../types'

export type MediaPayload =
ImagePayload | VideoPayload | DocumentPayload | AudioPayload |
RegisteredContactPayload | UnregisteredContactPayload | GifPayload | MusicPayload

export type MediaType = MediaPayload['type']

export interface MediaOptions<
  P = {},
  Type extends MediaType = MediaType
> {
  aitu: Aitu
  payload: P
  type: Type
}

export class Media<P = {}, Type extends MediaType = MediaType> {
  public static fromObject (media: MediaPayload, aitu: Aitu): Media {
    const handlers: Record<MediaType, Constructor<Media>> = {
      Image: ImageMedia,
      Video: VideoMedia,
      Document: DocumentMedia,
      Audio: AudioMedia,
      RegisteredContact: ContactMedia,
      UnregisteredContact: ContactMedia,
      Gif: GifMedia,
      Music: MusicMedia
    }

    const MediaConstructor = handlers[media.type]
    return new MediaConstructor({
      aitu, payload: media, type: media.type
    })
  }

  public type: MediaType
  public payload: P
  protected aitu: Aitu

  public constructor (options: MediaOptions<P, Type>) {
    this.aitu = options.aitu
    this.payload = options.payload
    this.type = options.type
  }

  public get isSendable (): boolean {
    return false
  }

  public get [Symbol.toStringTag] (): string {
    return this.constructor.name
  }

  public inspect (): Record<string, unknown> {
    return {
      ...this.serialize(),
      type: this.type
    }
  }

  public serialize (): Record<string, unknown> {
    return {
      payload: this.payload
    }
  }
}

inspectable(Media, {
  serialize: (instance) => instance.inspect(),
  stringify: (instance, payload, context): string => (
    `${context.stylize(instance.constructor.name, 'special')} ${context.inspect(payload)}`
  )
})
