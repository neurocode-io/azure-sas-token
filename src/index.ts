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

const computeHMACSHA256 = async (stringToSign: string, accountKey: string): Promise<string> => {
  const enc = new TextEncoder()
  const signatureUTF8 = enc.encode(stringToSign)
  const keyData = enc.encode(btoa(accountKey))

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
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

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
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

  let queryParams = {
    sp: input.permissions ?? '',
    st: input.startsOn ? truncatedISO8061Date(input.startsOn) : '',
    se: truncatedISO8061Date(input.expiresOn),
    name: getCanonicalName(input.accountName, input.containerName, input.blobName),
    si: input.identifier ?? '',
    sip: input.ipRange ?? '',
    spr: input.protocol ?? '',
    sv: version,
    sr: resource,
    ne: signedSnapshotTime,
    rscc: input.cacheControl ?? '',
    rscd: input.contentDisposition ?? '',
    rsce: input.contentEncoding ?? '',
    rscl: input.contentLanguage ?? '',
    rsct: input.contentType ?? '',
  }

  const stringToSign = Object.values(queryParams).join('\n')

  const signature = await computeHMACSHA256(stringToSign, input.accountKey)
  const { name, ne, ...rest } = queryParams

  //@ts-ignore
  queryParams.sig = signature

  return Object.keys({ ...rest, ...{ sig: signature } })
    .map((key) => {
      if (queryParams[key] === '') return

      return `${key}=${encodeURIComponent(queryParams[key])}`
    })
    .filter((el) => el)
    .join('&')
}

const createBlobSas = async (input: SASinput) => {
  const url = [input.containerName, input.blobName].filter((el) => el).join('/')
  const storageUri = new URL(url, `https://${input.accountName}.blob.core.windows.net`)
  const queryParams = await getSASqueryParams(input)

  storageUri.search = queryParams

  return {
    blobSasUrl: storageUri.toString(),
  }
}

export { createBlobSas }
