interface FormActionBase {
  /* eslint-disable camelcase */
  action: string
  data_template?: string
  hidden_metadata?: string
}

interface SendMessageAction extends FormActionBase {
  action: 'send_message'
  /** Text to be sent, you can use `{${formId}.${inputId}}` to substitute input value */
  data_template: string
}

interface SubmitFormAction extends FormActionBase {
  action: 'submit_form'
  /** Text to be sent, you can use `{${formId}.${inputId}}` to substitute input value */
  data_template?: string
}

interface CloseFormAction extends FormActionBase {
  action: 'close_form'
}

interface OpenUrlAction extends FormActionBase {
  action: 'open_url'
  /** URL to be opened in browser */
  data_template: string
}

interface ShareDataAction extends FormActionBase {
  action: 'share_data'
  /** Text to be shared */
  data_template: string
}

interface OpenPeerAction extends FormActionBase {
  action: 'open_peer'
  /** Username to be opened (@username) */
  data_template: string
}

interface SendPrivateDataAction extends FormActionBase {
  action: 'send_private_data'
  /** Data type */
  data_template: 'phone'
}

interface RedirectCallAction extends FormActionBase {
  action: 'redirect_call'
  /** Phone number to be opened in dialer */
  data_template: string
  /* eslint-enable camelcase */
}

export type FormAction =
SendMessageAction |
SubmitFormAction |
CloseFormAction |
OpenUrlAction |
ShareDataAction |
OpenPeerAction |
SendPrivateDataAction |
RedirectCallAction
