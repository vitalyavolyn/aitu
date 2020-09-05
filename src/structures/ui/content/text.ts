import { Options, FormAction } from '..'
import { BaseContent } from '.'

export interface Text extends BaseContent {
  /* eslint-disable camelcase */
  type: 'text'
  id?: string
  title: string
  options?: Options
  form_action?: FormAction
}
