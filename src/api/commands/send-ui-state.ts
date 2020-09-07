import { Peer, UiState } from '../../interfaces'

export interface SendUiStateParams {
  recipient: Peer
  dialog?: Peer
  uiState: UiState
}

export type SendUiState = (params: SendUiStateParams) => Promise<{}>
