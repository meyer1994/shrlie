import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const TLie = sqliteTable('lie', {
  id: text('id')
    .primaryKey(),
  text: text('text')
    .notNull(),
  image: text('image'),
  imageAlt: text('image_alt'),
  title: text('title'),
  description: text('description'),
  author: text('author'),
  twitter: text('twitter'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
})
