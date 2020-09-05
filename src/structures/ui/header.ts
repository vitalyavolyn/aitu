import { Options, FormAction } from '.'

export interface Header {
  type: 'title' | 'toolbar'
  title: string
  options?: Options // closeable, has_back_action
  // eslint-disable-next-line camelcase
  form_action?: FormAction
}
