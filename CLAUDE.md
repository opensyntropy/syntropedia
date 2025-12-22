# Claude Code Instructions

## Git Workflow

- **Do not push unless explicitly requested** - Only commit changes locally. Push to remote only when the user explicitly asks to push.

## Database Schema Changes

- **Update seed file when adding new fields** - Whenever a new field is added to the Prisma schema, update `prisma/seed.ts` with sample data for the new field across all relevant seed entries. This ensures the seed data stays in sync with the schema.

## URL Conventions

- **Always use English for URLs** - All routes and URL paths must be in English regardless of the UI language
- Examples: `/catalog`, `/species`, `/submissions`, `/about` (not `/catalogo`, `/especies`, `/submissoes`, `/sobre`)

## Project Structure

- Next.js 13+ with App Router
- Locale stored in cookie (`NEXT_LOCALE`), not in URL
- Translations in `/messages/{locale}.json`

## Form Actions

- **All form actions must display success/error feedback** - Every form submission and API call must show visible feedback to the user using `ToastNotification` component
- Include localized messages for all three languages (en, pt-BR, es)

## Development Server

- **Auto-restart dev server when needed** - When schema changes require a server restart (e.g., after `npx prisma generate`), restart the dev server automatically without asking the user
