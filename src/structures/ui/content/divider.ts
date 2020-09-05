import { Options } from '..'
import { BaseContent } from '.'

export interface Divider extends BaseContent {
  type: 'divider'
  id?: string
  // divider_type
  options?: Options
}
