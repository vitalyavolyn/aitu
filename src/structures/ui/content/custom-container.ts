import { Options, FormAction } from '..'
import { BaseContent, CardContent } from '.'

// also known as CustomLayout
export interface CustomContainer extends BaseContent {
  /* eslint-disable camelcase */
  type: 'custom_container'
  id?: string
  // indent_inner, indent_outer, background, backgroundColor
  options?: Options
  content: CardContent[]
  form_action?: FormAction
}

export interface CardContainer extends Omit<CustomContainer, 'type'> {
  type: 'card_container'
}
