import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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

export const TClick = sqliteTable('click', {
  id: text('id')
    .primaryKey(),
  lieId: text('lie_id')
    .notNull()
    .references(() => TLie.id, { onDelete: 'cascade' }),
  ip: text('ip'),
  userAgent: text('user_agent'),
  referer: text('referer'),
  cf: text('cf', { mode: 'json' })
    .$type<IncomingRequestCfProperties>(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
}, table => [
  index('click_lie_id_idx').on(table.lieId),
])
