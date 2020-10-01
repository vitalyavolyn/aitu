import { Peer, UiState } from '../../interfaces'

export interface SendUiStateParams {
  recipient: Peer
  dialog?: Peer
  uiState: UiState
}

/** Sends UI State information without sending a message */
export type SendUiState = (params: SendUiStateParams) => Promise<{}>
