// Server-side translation helper - only use in server components
export async function getTranslations(locale: string, namespace?: string) {
  const messages = await import(`../../messages/${locale}.json`)

  return (key: string) => {
    // Return key if it's undefined or not a string
    if (!key || typeof key !== 'string') {
      return key || ''
    }

    // Split the key by dots to handle nested paths
    const keys = key.split('.')

    let value: any = namespace ? messages.default[namespace] : messages.default

    // Navigate through nested objects
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return the key if path not found
      }
    }

    return typeof value === 'string' ? value : key
  }
}
