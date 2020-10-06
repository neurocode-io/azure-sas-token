# Azure-SAS-token

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=NeuroCode-io_azure-sas-token&metric=alert_status)](https://sonarcloud.io/dashboard?id=NeuroCode-io_azure-sas-token)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=NeuroCode-io_azure-sas-token&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=NeuroCode-io_azure-sas-token)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=NeuroCode-io_azure-sas-token&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=NeuroCode-io_azure-sas-token)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=NeuroCode-io_azure-sas-token&metric=security_rating)](https://sonarcloud.io/dashboard?id=NeuroCode-io_azure-sas-token)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=NeuroCode-io_azure-sas-token&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=NeuroCode-io_azure-sas-token)


Generate Azure SAS tokens on the edge with cloudflare workers and this library. 
This library has zero depdendencies.

We used it in our [sepa-form-recogizer](https://neurocode.io/blog/sepa-payment-recognizer?s=github) API

## What is a SAS token?

![sas](./sas-storage-uri.png)


SAS token is a string that you generate and give your client for temp access to your Azure storage. The Azure Storage client library does not work in the browser since it uses NodeJS crypto to compute the HMAC SHA256.

This library uses webCrypto to compute the HMAC SHA256 and is thus compatible with cloudflare workers.


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

Be careful with **startsOn** property. If you set the start time for a SAS to the current time, you may observe failures occurring intermittently for the first few minutes due to different machines having slight variations of the current time (known as clock skew). 

In general, set the start time to be at least 15 minutes in the past. Or, don't set it at all :)



## Current implementation

- [x] Blob SAS token
- [ ] Container SAS token
- [ ] Account SAS token

