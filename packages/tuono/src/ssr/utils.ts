function concatArrayBuffers(chunks: Array<Uint8Array>): Uint8Array {
  const result = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0))
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  return result
}

async function streamToArrayBuffer(
  stream: ReadableStream<Uint8Array>,
): Promise<Uint8Array> {
  const chunks: Array<Uint8Array> = []

  // @ts-expect-error ReadableStream has AsyncIterator https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#async_iteration
  // eslint-disable-next-line @typescript-eslint/await-thenable
  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array)
  }

  return concatArrayBuffers(chunks)
}

/**
 * This function awaits for the whole stream before returning the string.
 *
 * NOTE: we should improve the bond between the custom V8 runtime and the
 * renderToReadableStream React function to return a stream directly to the client.
 */
export async function streamToString(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const buffer = await streamToArrayBuffer(stream)
  return new TextDecoder().decode(buffer)
}
