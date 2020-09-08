import { Options } from '..'
import { BaseContent } from '.'

export interface Switch extends BaseContent {
  /* eslint-disable camelcase */
  type: 'switch'
  id: string
  title?: string
  /** Is enabled by default (default - true) */
  default_state?: boolean
  // indent_outer
  options?: Options
  /* eslint-enable camelcase */
}
