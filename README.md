# aitu [![npm](https://img.shields.io/npm/v/aitu?style=flat-square)](https://www.npmjs.com/package/aitu) [![CircleCI](https://img.shields.io/circleci/build/github/vitalyavolyn/aitu?style=flat-square)](https://app.circleci.com/pipelines/github/vitalyavolyn/aitu?branch=master)

A module for Aitu.io's service API, heavily inspired by [negezor/vk-io](https://github.com/negezor/vk-io) and [nitreojs/puregram](https://github.com/nitreojs/puregram).

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
