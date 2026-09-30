import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const TLie = sqliteTable('lie', {
  id: text('id')
    .primaryKey(),
  text: text('text')
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
})
