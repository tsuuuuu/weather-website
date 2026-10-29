import { createContext, useEffect, useMemo, type ReactNode } from 'react'
import { useStoredState } from '../hooks/useStoredState'
import { createFormat, type Format } from '../lib/format'
import { STORAGE_KEYS } from '../lib/storage'
import type { Messages } from './en'
import { browserLanguages, detectLanguage, localeFor, MESSAGES, type Language } from './languages'

export interface I18n {
    language: Language
    locale: string
    t: Messages
    format: Format
    // null goes back to following the browser
    setLanguage: (language: Language | null) => void
}

export const I18nContext = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
    // Only a language the user picked is stored; otherwise we follow the browser
    const [chosen, setChosen] = useStoredState<Language | null>(STORAGE_KEYS.language, null)

    const value = useMemo<I18n>(() => {
        const preferred = browserLanguages()
        const language = chosen && chosen in MESSAGES ? chosen : detectLanguage(preferred)
        const locale = localeFor(language, preferred)
        return {
            language,
            locale,
            t: MESSAGES[language],
            format: createFormat(locale),
            setLanguage: setChosen,
        }
    }, [chosen, setChosen])

    useEffect(() => {
        document.documentElement.lang = value.locale
    }, [value.locale])

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
