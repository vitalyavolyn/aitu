import { FormAction } from '..'
import { BaseContent } from '.'

export interface BottomBar extends BaseContent {
  /* eslint-disable camelcase */
  type: 'bottom_bar'
  id: string
  title: string
  form_action: FormAction
}
