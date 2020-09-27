
type SASinput = {
  accountKey: string
  accountName: string
  containerName: string
  blobName: string
  permissions: string
  expiresOn: Date
  startsOn?: Date
  identifier?: string
  ipRange?: string
  protocol?: string
  cacheControl?: string
  contentDisposition?: string
  contentEncoding?: string
  contentLanguage?: string
  contentType?: string
}

const truncatedISO8061Date = (date: Date) => {
  const dateString = date.toISOString()

  return dateString.substring(0, dateString.length - 5) + 'Z'
}

const computeHMACSHA256 = async (stringToSign: string, accountKey: string) => {
  const enc = new TextEncoder()
  const signatureUTF8 = enc.encode(stringToSign)
  const key = await crypto.subtle.importKey(
    'raw',
    Buffer.from(accountKey, 'base64'),
    {
      name: 'HMAC',
      hash: {
        name: 'SHA-256',
      },
    },
    false,
    ['sign']
  )

  const digest = await crypto.subtle.sign('HMAC', key, signatureUTF8)

  return Buffer.from(digest).toString('base64')
}

const getCanonicalName = (accountName: string, containerName: string, blobName?: string) => {
  const elements: string[] = [`/blob/${accountName}/${containerName}`]
  if (blobName) {
    elements.push(`/${blobName}`)
  }
  return elements.join('')
}

const getSASqueryParams = async (input: SASinput) => {
  const resource = 'b'
  const version = '2018-11-09'
  const signedSnapshotTime = undefined

  const stringToSign = [
    input.permissions ? input.permissions : '',
    input.startsOn ? truncatedISO8061Date(input.startsOn) : '',
    truncatedISO8061Date(input.expiresOn),
    getCanonicalName(input.accountName, input.containerName, input.blobName),
    input.identifier ? input.identifier : '',
    input.ipRange ? input.ipRange : '',
    input.protocol ? input.protocol : '',
    version,
    resource,
    signedSnapshotTime,
    input.cacheControl ? input.cacheControl : '',
    input.contentDisposition ? input.contentDisposition : '',
    input.contentEncoding ? input.contentEncoding : '',
    input.contentLanguage ? input.contentLanguage : '',
    input.contentType ? input.contentType : '',
  ].join('\n')

  const signature = await computeHMACSHA256(stringToSign, input.accountKey)

  return `sv=${version}&spr=https&se=${encodeURIComponent(
    truncatedISO8061Date(input.expiresOn)
  )}&sr=b&sp=rw&sig=${encodeURIComponent(signature)}`
}

export default async (input: SASinput) => {
  const url = [input.containerName, input.blobName].filter(el => el).join('/')
  const storageUri = new URL(url, `https://${input.accountName}.blob.core.windows.net`)
  const queryParams = await getSASqueryParams(input)

  storageUri.search = queryParams

  return {
    blobSasUrl: url.toString(),
  }
}
