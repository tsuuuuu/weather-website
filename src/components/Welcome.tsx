import { useI18n } from '../i18n/useI18n'
import { LocateIcon } from './Icons'
import styles from './Welcome.module.css'

interface WelcomeProps {
    onLocate: () => void
    // Searches for a suggested city by name, so it comes back named in the user's language
    onSuggestion: (name: string) => void
    locating: boolean
    locateError?: string
}

// First visit: no place chosen yet
export function Welcome({ onLocate, onSuggestion, locating, locateError }: WelcomeProps) {
    const { t } = useI18n()

    return (
        <section className={`card ${styles.welcome}`} aria-labelledby="welcome-title">
            <h1 id="welcome-title" className={styles.title}>
                {t.welcomeTitle}
            </h1>
            <p className={styles.lead}>{t.welcomeLead}</p>
            <button type="button" className={styles.locate} onClick={onLocate} disabled={locating}>
                <LocateIcon size={18} />
                {locating ? t.findingLocation : t.useMyLocation}
            </button>
            {locateError && (
                <p className={styles.error} role="alert">
                    {locateError}
                </p>
            )}
            <div className={styles.suggestions}>
                <span>{t.orTry}</span>
                {t.suggestions.map((name) => (
                    <button key={name} type="button" onClick={() => onSuggestion(name)}>
                        {name}
                    </button>
                ))}
            </div>
        </section>
    )
}
