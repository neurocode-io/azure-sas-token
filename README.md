# Azure-SAS-token

Generate Azure SAS tokens on the edge with cloudflare workers and this library. 
This library has zero depdendencies.

We used it in our [sepa-form-recogizer](https://neurocode.io/blog/sepa-payment-recognizer?s=github) API

## Install

Use either npm or yarn
```
npm i @neurocode.io/azure-sas-token
yarn add @neurocode.io/azure-sas-token
```

## How to use the library

```ts
import { createBlobSas } from '@neurocode.io/azure-sas-token'

const expireInMin = 5

const { blobSasUrl } = await createBlobSas({
      accountKey: 'yourStorageAccountKey',
      accountName: 'yourAccountName',
      containerName: 'youStorageContainerName',
      blobName: 'someBlob.txt',
      permissions: 'rw',
      expiresOn: new Date(new Date().valueOf() + expireInMin * 60 * 1000)
})

```

## Current implementation

- [x] Blob SAS token
- [ ] Container SAS token
- [ ] Account SAS token

