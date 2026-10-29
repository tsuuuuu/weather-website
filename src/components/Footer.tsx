import { useI18n } from '../i18n/useI18n'
import styles from './Footer.module.css'

export function Footer({ onAbout }: { onAbout: () => void }) {
    const { t } = useI18n()

    return (
        <footer className={styles.footer}>
            <p>
                {t.weatherDataBy}{' '}
                <a href="https://open-meteo.com/" target="_blank" rel="noopener">
                    Open-Meteo
                </a>{' '}
                · {t.placesBy}{' '}
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">
                    OpenStreetMap
                </a>
            </p>
            <p className={styles.links}>
                <button type="button" onClick={onAbout}>
                    {t.aboutContact}
                </button>
                <a href="https://github.com/tsuuuuu/weather-website" target="_blank" rel="noopener">
                    {t.sourceCode}
                </a>
                <span>{t.madeBy} · v2.0</span>
            </p>
        </footer>
    )
}
