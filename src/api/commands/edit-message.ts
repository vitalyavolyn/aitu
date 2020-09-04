import { Peer, UiState } from '../../interfaces'
import { KeyboardBuilder, Media, InputMedia, InlineCommand } from '../../structures'

export interface EditMessageParams {
  /** Peer the message was sent to */
  recipient: Peer
  /** UUID of the message to edit */
  messageId: string
  /** Message text. Max length - 4096 */
  content: string
  inlineCommandRows?: InlineCommand[][] | KeyboardBuilder
  uiState?: UiState
  mediaList?: (InputMedia | Media)[]
}

export type EditMessage = (params: EditMessageParams) => Promise<{}>
