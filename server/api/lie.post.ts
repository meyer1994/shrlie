import { uuidv7 } from 'uuidv7'
import * as z from 'zod'
import { TLie } from '~~/server/db/schema'
import { serverDrizzle } from '~~/server/lib/drizzle'

const schema = z.object({
  text: z.string().trim().min(1).max(1000),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  const db = serverDrizzle(event)

  const lie = await db.insert(TLie)
    .values({ id: uuidv7(), text: body.text })
    .returning()
    .get()

  setResponseStatus(event, 201)
  return lie
})
