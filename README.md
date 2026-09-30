# shrlie

Nuxt 4 app on Cloudflare Workers (D1).

## Endpoints

```text
POST /api/lie     Create a lie  { text: string }  -> 201 { id, text, createdAt }
```

## Development

```bash
pnpm install
pnpm db:migrate -- --local
pnpm dev
```

## Database

```bash
# After schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate -- --local
pnpm db:migrate -- --remote
```

## Deploy

```bash
pnpm build
pnpm cf:deploy
```

Regenerate Worker binding types after changing `wrangler.jsonc`:

```bash
pnpm cf:types
```
