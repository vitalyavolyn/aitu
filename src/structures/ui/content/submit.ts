import { Options, FormAction } from '..'
import { BaseContent } from '.'

export interface Submit extends BaseContent {
  /* eslint-disable camelcase */
  type: 'submit'
  id: string
  title: string
  options?: Options
  form_action: FormAction
}
