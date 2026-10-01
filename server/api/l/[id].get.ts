import { eq } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'
import * as z from 'zod'
import { TClick, TLie } from '~~/server/db/schema'
import { serverDrizzle } from '~~/server/lib/drizzle'

const schema = z.object({ id: z.string() })

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, schema.parse)
  const db = serverDrizzle(event)

  const lie = await db.select().from(TLie).where(eq(TLie.id, id)).get()
  if (!lie) throw createError({ status: 404, message: 'Lie not found' })

  await db.insert(TClick).values({
    id: uuidv7(),
    lieId: id,
    ip: getRequestHeader(event, 'cf-connecting-ip') ?? getRequestIP(event, { xForwardedFor: true }),
    userAgent: getRequestHeader(event, 'user-agent'),
    referer: getRequestHeader(event, 'referer'),
    cf: event.context.cf as IncomingRequestCfProperties | undefined,
  })

  const views = await db.$count(TClick, eq(TClick.lieId, id))

  return { ...lie, views }
})
