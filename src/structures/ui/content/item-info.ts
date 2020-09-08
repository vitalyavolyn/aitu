import { Options, FormAction, FileMetadata } from '..'
import { BaseContent } from '.'

export interface ItemInfo extends BaseContent {
  /* eslint-disable camelcase */
  type: 'item_info'
  id: string
  title: string
  subtitle?: string
  file_metadata?: FileMetadata
  // show_divider, indent_outer, (iconResource?)
  options?: Options
  form_action?: FormAction
  /* eslint-enable camelcase */
}
