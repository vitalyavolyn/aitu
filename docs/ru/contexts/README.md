# Контексты

У каждого события в API Aitu существует соответствующий **контекст**. Они содержат в себе **геттеры** (иногда - с информацией, представленной в более удобном формате) и **методы**.

## Все контексты

- `Context` - Основной класс, от которого наследуются все остальные
- `MessageContext` (Message, MessageEdited)
- `KickInviteContext` (InvitedToGroup, InvitedToChannel, KickedFromChannel, KickedFromGroup)
- `ChannelAdminContext` (ChannelAdminAdded, ChannelAdminDeleted)
- `NewChannelSubscriberContext` (NewChannelSubscriber)
- `ChannelPermissionsContext` (ChannelPermissionsGranted, ChannelPermissionsRevoked)
- `InlineCommandSelectedContext` (InlineCommandSelected)
- `MessageIdAssignedContext` (MessageIdAssigned)
- `QuickButtonSelectedContext` (QuickButtonSelected)
- `FormContext` (FormClosed, FormMessageSent, FormSubmitted)

<!-- TODO: сделать документацию к каждому контексту -->
