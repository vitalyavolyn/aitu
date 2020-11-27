import { createReadStream } from 'fs'
import createDebug from 'debug'
import FormData from 'form-data'
import fetch from 'node-fetch'

import { Aitu } from './aitu'
import { uploadFilesResponse } from './api'
import { AllowArray } from './types'

export type UploadFile = string | Buffer | NodeJS.ReadableStream

export interface UploadFilesParams {
  value: UploadFile
  filename?: string
}

export type UploadFilesInput = AllowArray<UploadFilesParams | UploadFile>

const isURL = /^https?:\/\//i
const debug = createDebug('aitu:uploads')

export class Upload {
  public constructor (private aitu: Aitu) {}

  private normalizeInput (input: UploadFilesInput): UploadFilesParams[] {
    const arr = Array.isArray(input) ? input : [input]

    return arr.map((e) => {
      if (typeof e !== 'string' && 'value' in e) {
        return e
      }

      return { value: e }
    })
  }

  private async buildPayload (files: UploadFilesParams[]): Promise<FormData> {
    const formData = new FormData()

    files.map(async ({ value: file, filename }, i) => {
      let value

      if (typeof file === 'string') {
        if (isURL.test(file)) {
          debug('downloading file', file)
          const response = await fetch(file)
          value = await response.buffer()
        } else {
          value = createReadStream(file)
        }
      } else {
        value = file
      }

      const name = `file${i}`

      return formData.append(name, value, filename)
    })

    await Promise.all(files)

    return formData
  }

  public async uploadFiles (input: UploadFilesInput): Promise<uploadFilesResponse> {
    const files = this.normalizeInput(input)
    const formData = await this.buildPayload(files)
    return this.aitu.api.uploadFiles(formData)
  }
}
