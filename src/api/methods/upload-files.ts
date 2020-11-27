import FormData from 'form-data'

export type uploadFilesParams = FormData

export interface uploadFilesResponse {
  uploadedFiles: [
    {
      fileId: string
      fileName: string
    }
  ]
}

/** Upload files */
export type uploadFiles = (params: uploadFilesParams) => Promise<uploadFilesResponse>
