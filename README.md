# Azure-SAS-token

Generate Azure SAS tokens on the edge with cloudflare workers and this library.

Zero depdendencies.


## How to use the library

```ts
import createBlobSas from './index'

const expireInMin = 5

const { blobSasUrl } = await createBlobSas({
      accountKey: 'asd',
      accountName: '1132',
      blobName: '123.txt',
      permissions: 'rw',
      containerName: 'container',
      expiresOn: new Date(new Date().valueOf() + expireInMin * 60 * 1000)
})
```
