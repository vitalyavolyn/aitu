# aitu [![npm](https://img.shields.io/npm/v/aitu?style=flat-square)](https://www.npmjs.com/package/aitu) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/vitalyavolyn/aitu/Run%20tests%20and%20build?style=flat-square) [![Aitu chat](https://img.shields.io/badge/chat-aitu-2e4de5?style=flat-square)](https://i2.app.link/7S8HEZt9Aab)

A module for Aitu.io's service API, heavily inspired by [negezor/vk-io](https://github.com/negezor/vk-io) and [nitreojs/puregram](https://github.com/nitreojs/puregram).

[Documentation (RU)](https://github.com/vitalyavolyn/aitu/blob/master/docs/ru/README.md)

## Installation

### Yarn

Recommended

```sh
yarn add aitu
```

### NPM

```sh
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

[More examples](https://github.com/vitalyavolyn/aitu/blob/master/examples)
