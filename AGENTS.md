# shrlie Agent Guide

Nuxt 4 app deployed on Cloudflare Workers with D1 (SQLite).

## Stack

- **Frontend**: Vue 3, Nuxt 4, Nuxt UI, VueUse
- **Backend**: Nitro / H3 API routes, Drizzle ORM
- **DB**: Cloudflare D1 (SQLite)
- **Package Manager**: pnpm

## Structure

```
├── app/
│   ├── app.vue               # the whole UI
│   └── assets/css/main.css
├── server/
│   ├── api/lie.post.ts       # POST /api/lie
│   ├── db/                   # schema.ts, migrations/
│   └── lib/drizzle.ts        # serverDrizzle(event)
├── shared/                   # wrangler.d.ts, env.d.ts
├── drizzle.config.ts
└── wrangler.jsonc            # D1 binding
```

## Endpoints

```text
POST /api/lie     { text: string }  -> 201 { id, text, createdAt }
```

---

## Commands

### Dev

```bash
pnpm install
pnpm db:migrate -- --local
pnpm dev              # Nuxt dev server (localhost:3000)
pnpm build            # production build
pnpm preview          # preview production build locally
pnpm typecheck        # TypeScript type check
pnpm lint             # ESLint
pnpm lint:fix         # auto-fix lint issues
pnpm clean            # remove .output .wrangler .nuxt node_modules
```

### Database (Drizzle + Wrangler D1)

```bash
pnpm db:generate                 # generate drizzle migration from schema.ts
pnpm db:migrate -- --local       # apply migrations to local D1
pnpm db:migrate -- --remote      # apply migrations to remote D1

wrangler d1 execute shrlie --local --command "SELECT * FROM lie"
wrangler d1 execute shrlie --remote --command "SELECT * FROM lie"
```

### Cloudflare

```bash
# Regenerate TypeScript bindings after changing wrangler.jsonc
pnpm cf:types

# Deploy (build first)
pnpm build
pnpm cf:deploy                   # wrangler --cwd .output deploy
```

---

## Database (Drizzle)

Get a DB handle in API routes with `serverDrizzle(event)`.

### Table pattern

```typescript
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const TLie = sqliteTable('lie', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
})
```

### Queries

```typescript
await db.select().from(TTable).where(eq(TTable.id, id))
await db.insert(TTable).values({ ... }).returning()
await db.update(TTable).set({ ... }).where(eq(TTable.id, id)).returning()
await db.delete(TTable).where(eq(TTable.id, id)).returning()

// Single row (D1 / SQLite)
await db.select().from(TTable).where(eq(TTable.id, id)).get()
```

---

## API Routes

Routes live in `server/api/`, named `<path>.<method>.ts`.

```typescript
import * as z from 'zod'
import { TLie } from '~~/server/db/schema'
import { serverDrizzle } from '~~/server/lib/drizzle'

const schema = z.object({ text: z.string().trim().min(1) })

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  const db = serverDrizzle(event)
  return await db.insert(TLie).values({ ... }).returning().get()
})
```

### Conventions

- Always validate input with Zod (`readValidatedBody`, `getValidatedQuery`, `getValidatedRouterParams`)
- Skip try/catch — keep routes simple
- Throw `createError({ statusCode, statusMessage })` for not-found / internal errors
- Use UUIDv7 (`uuidv7`) for ids

---

## Frontend

Call the API with `$fetch` (actions) or `useFetch` (data loading).

```typescript
await $fetch('/api/lie', { method: 'POST', body: { text } })
```

---

## UI & Theming

| Token     | Use               |
| --------- | ----------------- |
| primary   | CTAs, brand       |
| secondary | Alt actions       |
| success   | Confirmations     |
| info      | Neutral alerts    |
| warning   | Attention         |
| error     | Destructive       |
| neutral   | Backgrounds, text |

---

## Links

- [Nuxt](https://nuxt.com/docs) · [Nuxt UI](https://ui.nuxt.com/getting-started)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) · [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/commands/)
