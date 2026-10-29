import { useI18n } from '../i18n/useI18n'
import { LANGUAGES, MESSAGES, type Language } from '../i18n/languages'
import type { Place, Units } from '../types'
import { GlobeIcon } from './Icons'
import { SearchBox } from './SearchBox'
import styles from './Header.module.css'

interface HeaderProps {
    units: Units
    onUnitsChange: (units: Units) => void
    onSelectPlace: (place: Place) => void
    onLocate: () => void
    locating: boolean
}

export function Header({ units, onUnitsChange, onSelectPlace, onLocate, locating }: HeaderProps) {
    const { t, language, setLanguage } = useI18n()

    return (
        <header className={styles.header}>
            <a className={styles.brand} href="./" aria-label={t.home}>
                <img src="./favicon.svg" alt="" width={32} height={32} />
                <span>
                    Hayashi <strong>Weather</strong>
                </span>
            </a>

            <SearchBox onSelect={onSelectPlace} onLocate={onLocate} locating={locating} />

            <div className={styles.controls}>
                <label className={styles.language}>
                    <GlobeIcon size={16} />
                    <span className="visually-hidden">{t.language}</span>
                    <select
                        value={language}
                        onChange={(event) => setLanguage(event.target.value as Language)}
                    >
                        {LANGUAGES.map((code) => (
                            <option key={code} value={code} lang={code}>
                                {MESSAGES[code].languageName}
                            </option>
                        ))}
                    </select>
                </label>

                <div className={styles.units} role="group" aria-label={t.temperatureUnits}>
                    {(['metric', 'imperial'] as const).map((value) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={units === value}
                            onClick={() => onUnitsChange(value)}
                        >
                            {value === 'metric' ? '°C' : '°F'}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    )
}
