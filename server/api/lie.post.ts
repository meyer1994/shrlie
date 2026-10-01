import { uuidv7 } from 'uuidv7'
import * as z from 'zod'
import { TLie } from '~~/server/db/schema'
import { serverDrizzle } from '~~/server/lib/drizzle'

const optionalText = (max: number) => z.string()
  .trim()
  .max(max)
  .nullish()
  .transform(value => value || null)

const schema = z.object({
  text: z.string()
    .trim()
    .min(1)
    .max(1024),
  image: z.file()
    .max(5 * 1024 * 1024)
    .mime(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
    .optional(),
  imageAlt: optionalText(420),
  title: optionalText(70),
  description: optionalText(200),
  author: optionalText(50),
  twitter: z.string()
    .trim()
    .regex(/^@?\w{0,15}$/, 'Invalid Twitter handle')
    .nullish()
    .transform(value => value?.replace(/^@/, '') || null),
})

export default defineEventHandler(async (event) => {
  const form = await readFormData(event)

  const { data: parsed, success, error } = schema.safeParse(Object.fromEntries(form))
  if (!success) throw createError({ status: 400, message: 'Validation Error', data: error.issues })

  const id = uuidv7()
  const imageUrl = `lie:${id}`
  const db = serverDrizzle(event)
  const files = useStorage('files')

  if (parsed.image) {
    await files.setItemRaw(imageUrl, await parsed.image.arrayBuffer())
    await files.setMeta(imageUrl, {
      type: parsed.image.type,
      size: parsed.image.size,
      name: parsed.image.name,
    })
  }

  const lie = await db.insert(TLie)
    .values({
      id,
      text: parsed.text,
      image: imageUrl,
      imageAlt: parsed.imageAlt,
      title: parsed.title,
      description: parsed.description,
      author: parsed.author,
      twitter: parsed.twitter,
    })
    .returning()
    .get()

  setResponseStatus(event, 201)
  return lie
})
