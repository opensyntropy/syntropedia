# Claude Code Instructions

## URL Conventions

- **Always use English for URLs** - All routes and URL paths must be in English regardless of the UI language
- Examples: `/catalog`, `/species`, `/submissions`, `/about` (not `/catalogo`, `/especies`, `/submissoes`, `/sobre`)

## Project Structure

- Next.js 13+ with App Router
- Locale stored in cookie (`NEXT_LOCALE`), not in URL
- Translations in `/messages/{locale}.json`
