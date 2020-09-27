# Azure-SAS-token

Generate Azure SAS tokens on the edge with cloudflare workers and this library. 
This library has zero depdendencies.

We used it in our [sepa-form-recogizer](https://neurocode.io/blog/sepa-payment-recognizer?s=github) API

## Whats a SAS token?

![sas](./sas-storage-uri.png)

s
The SAS token is a string that you generate on give your client for temp access to your Azure storage. The Azure Storage client library does not work in the browser since it uses NodeJS crypto to compute the HMAC SHA256.

This library uses webCrypto to compute the HMAC SHA and is thus compatible with cloudflare workers.


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

Be careful with **startsOn** property. If you set the start time for a SAS to the current time, you may observe failures occurring intermittently for the first few minutes due to different machines having slight variations the current time (known as clock skew). 

In general, set the start time to be at least 15 minutes in the past. Or, don't set it at all :)



## Current implementation

- [x] Blob SAS token
- [ ] Container SAS token
- [ ] Account SAS token

