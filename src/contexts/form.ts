import { Context } from '.'
import { Update, Peer } from '../interfaces'
import { SendMessageParams } from '../api'
import {
  FormMessage,
  QuickButtonCommand,
  KeyboardBuilder,
  ContainerMessage,
  FormAction,
  Content
} from '../structures'
import { pickProperties } from '../utils'

interface FormUpdate extends Update {
  formId: string
  dialog: Peer
  sender: Peer
}

export interface FormClosedUpdate extends FormUpdate {
  type: 'FormClosed'
}

export interface FormSubmittedUpdate extends FormUpdate {
  type: 'FormSubmitted'
  metadata: string
  additionalMetadata: string
}

export interface FormMessageSentUpdate extends FormUpdate {
  type: 'FormMessageSent'
  message: string
  messageId: string
  additionalMetadata: string
}

interface FormContentResult {
  type: Content['type']
  id: string
  value?: string
}

export interface AdditionalMetadata {
  /* eslint-disable camelcase */
  data_template_result: string
  hidden_metadata: string
  logging_metadata?: { type: FormAction['action'], timestamp: number }
  form?: {
    /** Form results. For object-like structure, see `context.formResults` */
    content: FormContentResult[]
    /** Submitted form id */
    id: string
  }
  private_data?: {
    type: 'phone_number'
    value: {
      phone_number?: string
      metadata: string
    }
  }
  /* eslint-enable camelcase */
}

export type FormContextPayload = FormClosedUpdate | FormSubmittedUpdate | FormMessageSentUpdate
export type FormContextType = FormContextPayload['type']

export class FormContext extends Context<FormContextPayload> {
  public get formId (): string {
    return this.payload.formId
  }

  public get message (): string | undefined {
    return 'message' in this.payload ? this.payload.message : undefined
  }

  public get messageId (): string | undefined {
    return 'messageId' in this.payload ? this.payload.messageId : undefined
  }

  public get sender (): Peer {
    return this.payload.sender
  }

  public get chat (): Peer {
    return this.payload.dialog
  }

  public get metadata (): string | undefined {
    return 'metadata' in this.payload ? this.payload.metadata : undefined
  }

  public get additionalMetadata (): AdditionalMetadata | undefined {
    return 'additionalMetadata' in this.payload
      ? JSON.parse(this.payload.additionalMetadata)
      : undefined
  }

  /**
   * Get form results as an object where keys
   * are input ids and values are input values
   */
  public get formResults (): Record<string, string | undefined> {
    if (!this.additionalMetadata?.form) return {}

    return this.additionalMetadata.form.content.reduce(
      (acc, val) => ({ ...acc, [val.id]: val.value }),
      {}
    )
  }

  /** Send a message to the dialog */
  public async send (
    content: string | SendMessageParams,
    params?: Partial<SendMessageParams>
  ): Promise<{}> {
    const options: SendMessageParams = {
      recipient: this.payload.dialog,

      ...(
        typeof content === 'string'
          ? { content, ...params }
          : content
      )
    }

    return this.aitu.api.SendMessage(options)
  }

  /** Send a form to the dialog without sending a message */
  public async sendForm (formMessage: FormMessage): Promise<{}> {
    return this.aitu.api.SendUiState({
      uiState: { formMessage },
      recipient: this.chat
    })
  }

  /** Send quick buttons to the dialog without sending a message */
  public async sendQuickButtons (
    quickButtonCommands: QuickButtonCommand[] | KeyboardBuilder
  ): Promise<{}> {
    return this.aitu.api.SendUiState({
      uiState: { quickButtonCommands },
      recipient: this.chat
    })
  }

  /** Send a container message to the dialog */
  public async sendContainerMessage (content: ContainerMessage): Promise<{}> {
    return this.aitu.api.SendContainerMessage({ content, recipient: this.chat })
  }

  public serialize (): Record<string, unknown> {
    const props: (keyof this)[] = [
      'formId',
      'sender',
      'chat',
      'metadata',
      'additionalMetadata',
      'formResults'
    ]

    if (this.messageId) {
      props.push('message', 'messageId')
    }

    return pickProperties(this, props)
  }
}
