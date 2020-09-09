# aitu [![npm](https://img.shields.io/npm/v/aitu?style=flat-square)](https://www.npmjs.com/package/aitu) [![CircleCI](https://img.shields.io/circleci/build/github/vitalyavolyn/aitu?style=flat-square)](https://app.circleci.com/pipelines/github/vitalyavolyn/aitu?branch=master)

A module for Aitu.io's service API, heavily inspired by [negezor/vk-io](https://github.com/negezor/vk-io) and [nitreojs/puregram](https://github.com/nitreojs/puregram).

## Installation
### Yarn
Recommended
```
yarn add aitu
```

### NPM
```
npm i aitu
```

## Example usage
```js
const { Aitu } = require('aitu')

const aitu = new Aitu({
  // Token received from @MasterService
  token: ''
})

aitu.updates.on('Message', async context => {
  const { name } = await aitu.api.getMe()

  context.send(`Hello! My name is ${name}`)
})

aitu.updates.startPolling()
```

## Features left to do before 1.0.0

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
- [x] Write tests
- [ ] Write documentation
- [ ] Add more examples
- [x] `context.state`
- [ ] Proper handlers like `hear(conditions, handler)` that supports RegEx, Strings, Functions as conditions
- [ ] Scenes
- [ ] Sessions
- [x] Make classes [inspectable](https://github.com/negezor/inspectable)
- [x] Consider renaming `Aitu.callApi` to `api`
- [x] Add CI
- [x] Add types for QuickButtonCommand actions
- [ ] Split content options into separate interfaces
- [x] Add catalog content type
