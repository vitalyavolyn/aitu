# aitu
![npm](https://img.shields.io/npm/v/aitu?style=flat-square)
![CircleCI](https://img.shields.io/circleci/build/github/vitalyavolyn/aitu?style=flat-square)

A work-in-progress library for Aitu.io's ~~bot~~ Service API, heavily inspired by [negezor/vk-io](https://github.com/negezor/vk-io) and [nitreojs/puregram](https://github.com/nitreojs/puregram).

# To do

- [x] Add repo url to package.json
- [x] Remove SendContactMessage command (also InputContact types & interfaces?)
- [ ] Figure out how to send contacts without SendContactMessage
- [ ] Add webhook transport for updates
- [x] Add custom classes for Media
  - [x] Media files
  - [x] Contacts
  - [x] Add media getter & checker to MessageContext
- [x] Support all events:
  - [x] MessageIdAssigned
  - [x] QuickButtonSelected
  - [x] InlineCommandSelected
  - [x] FormSubmitted
  - [x] FormMessageSent
  - [x] FormClosed
- [ ] Support all [API methods](https://btsdigital.github.io/bot-api-contract/endpoints.html):
  - [x] All commands
  - [x] getMe
  - [x] getChannelInfo
  - [x] getChannelMessages (direction = EARLY | LATER | AROUND, messageId - required if direction is AROUND)
  - [ ] uploadFiles
  - [x] downloadFile - Supported in FileMedia
  - [ ] uploadAvatar
  - [ ] downloadAvatar
  - [x] getChannelAdmins
  - [x] getAvatar
  - [x] getWebhookInfo
  - [x] setWebhook
  - [x] deleteWebhook
- [ ] Files uploader
- [x] Form builder
- [x] QuickButton keyboard builder
- [x] InlineCommand keyboard builder
- [x] ReplyCommand keyboard builde
- [ ] Check all `// TODO` in code
- [ ] Write tests
- [ ] Write documentation
- [ ] Add more examples
- [x] `context.state`
- [ ] Proper handlers like `hear(conditions, handler)` that supports RegEx, Strings, Functions as conditions
- [ ] Scenes
- [ ] Sessions
- [x] Make classes [inspectable](https://github.com/negezor/inspectable)
- [x] Consider renaming `Aitu.callApi` to `api`
- [x] Add CI
- [ ] Serialize/parse button metatada (if it's an object)
- [x] Add types for QuickButtonCommand actions
- [ ] Split content options into separate interfaces
- [x] Add catalog content type
