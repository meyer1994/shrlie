import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { TLie } from '~~/server/db/schema'
import { serverDrizzle } from '~~/server/lib/drizzle'

const schema = z.object({ id: z.string() })

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, schema.parse)

  const db = serverDrizzle(event)
  const files = useStorage('files')

  const lie = await db.select().from(TLie).where(eq(TLie.id, id)).get()
  if (!lie?.image) throw createError({ status: 404, message: 'Image not found' })

  const body = await files.getItemRaw<ReadableStream>(lie.image, { type: 'stream' })
  if (!body) throw createError({ status: 404, message: 'Image not found' })

  const meta = await files.getMeta(lie.image)
  setResponseHeaders(event, {
    'content-type': typeof meta.type === 'string' ? meta.type : 'application/octet-stream',
    'cache-control': 'public, max-age=31536000, immutable',
  })

  return sendStream(event, body)
})
