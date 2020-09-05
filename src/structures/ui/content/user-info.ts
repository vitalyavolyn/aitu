import { Options } from '..'
import { BaseContent } from '.'

export interface UserInfo extends BaseContent {
  /* eslint-disable camelcase */
  type: 'user_info'
  id: string
  user_id: string
  // indent_outer
  options?: Options
}
