// List of all supported locales
export const locales = ['en', 'pt-BR', 'es'] as const
export type Locale = (typeof locales)[number]
