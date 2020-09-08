import { Options, FormAction, FileMetadata } from '..'
import { BaseContent } from '.'

/**
 * Note: won't display unless options.width
 * and options.height are present
 */
export interface Image extends BaseContent {
  /* eslint-disable camelcase */
  type: 'image'
  id?: string
  file_metadata: FileMetadata
  // width, height, indent_outer (?), flex_options, alignment
  options?: Options
  form_action?: FormAction
  /* eslint-enable camelcase */
}
