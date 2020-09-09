import {
  Aitu,
  Media,
  MediaPayload,
  FileMedia
} from '../src'

const aitu = new Aitu({ token: '' })

const mediaArr: MediaPayload[] = [
  {
    fileId: '41534b19-f2ad-11ea-ab1a-62e1faec30e1',
    mimeType: 'M4A',
    name: 'e2ec2f79-66d8-4af2-9eed-594da3d524ab',
    size: 11544,
    type: 'Audio'
  },
  {
    fileId: 'e31b7c8d-f2af-11ea-ab1a-62e1faec30e1',
    mimeType: 'JPEG',
    name: 'IMG_20200909_094056.jpg',
    size: 628043,
    width: 719,
    height: 1280,
    type: 'Image'
  },
  {
    firstName: 'KFC',
    lastName: '',
    phoneNumber: '7797',
    type: 'UnregisteredContact'
  },
  {
    fileId: '20175fc1-ec77-11ea-b9bf-3e17b75e2f4d',
    name: 'sample.mp4',
    mimeType: 'MP4',
    size: 1570024,
    width: 480,
    height: 270,
    duration: 31,
    type: 'Video'
  },
  {
    user: {
      id: '',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '88005553535',
      userName: '',
      avatar: {
        full: {
          fileId: '',
          mimeType: 'UNKNOWN',
          name: '',
          size: 0,
          width: 0,
          height: 0,
          type: 'Image'
        },
        small: {
          fileId: '',
          mimeType: 'UNKNOWN',
          name: '',
          size: 0,
          width: 0,
          height: 0,
          type: 'Image'
        }
      }
    },
    type: 'RegisteredContact'
  },
  {
    fileId: '9ed482d8-f2b2-11ea-9419-b2ad371ea6b6',
    name: 'Rick-Astley-Never-Gonna-Give-You-Up.mp3',
    mimeType: 'MP3',
    size: 5102989,
    type: 'Document'
  }
]

describe('Media', () => {
  for (const mediaPayload of mediaArr) {
    describe(mediaPayload.type, () => {
      it('can be created from JSON', () => {
        Media.fromObject(mediaPayload, aitu)
      })

      const media = Media.fromObject(mediaPayload, aitu)
      if (media.isSendable && media instanceof FileMedia) {
        it('can be serialized into InputMedia', () => {
          (media as FileMedia).toJSON()
        })
      }
    })
  }
})
