import { en, type Messages } from './en'
import { es } from './es'
import { pt } from './pt'

export type Language = 'en' | 'pt' | 'es'

export const MESSAGES: Record<Language, Messages> = { en, pt, es }

export const LANGUAGES = Object.keys(MESSAGES) as Language[]

// Used for dates and numbers when the browser gives no regional variant we can reuse
const DEFAULT_LOCALES: Record<Language, string> = { en: 'en-US', pt: 'pt-BR', es: 'es-ES' }

const baseLanguage = (tag: string) => tag.toLowerCase().split('-')[0]

const isLanguage = (value: string): value is Language => value in MESSAGES

// First supported language in the browser's preference list, English otherwise
export function detectLanguage(preferred: readonly string[]): Language {
    for (const tag of preferred) {
        const base = baseLanguage(tag)
        if (isLanguage(base)) return base
    }
    return 'en'
}

// Keep the user's region when it matches the language (es-MX, pt-PT, en-GB...)
export function localeFor(language: Language, preferred: readonly string[]): string {
    return preferred.find((tag) => baseLanguage(tag) === language) ?? DEFAULT_LOCALES[language]
}

// Countries that use Fahrenheit
const IMPERIAL_REGIONS = new Set(['US', 'LR', 'MM'])

export function defaultUnitsFor(locale: string) {
    const region = new Intl.Locale(locale).maximize().region
    return region && IMPERIAL_REGIONS.has(region) ? 'imperial' : 'metric'
}

export const browserLanguages = (): readonly string[] =>
    typeof navigator === 'undefined'
        ? []
        : navigator.languages?.length
          ? navigator.languages
          : [navigator.language]
