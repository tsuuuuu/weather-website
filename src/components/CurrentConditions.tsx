import { useI18n } from '../i18n/useI18n'
import { placeDetails } from '../lib/format'
import { weatherLabel } from '../lib/weatherCodes'
import type { Forecast, Place } from '../types'
import { StarIcon } from './Icons'
import { WeatherIcon } from './WeatherIcon'
import styles from './CurrentConditions.module.css'

interface CurrentConditionsProps {
    place: Place
    forecast: Forecast
    isFavorite: boolean
    onToggleFavorite: () => void
}

export function CurrentConditions({
    place,
    forecast,
    isFavorite,
    onToggleFavorite,
}: CurrentConditionsProps) {
    const { t, format } = useI18n()
    const { current } = forecast
    const today = forecast.daily[0]
    const favoriteLabel = isFavorite ? t.removeFavorite : t.addFavorite

    return (
        <section className={`card ${styles.hero}`} aria-labelledby="current-place">
            <div className={styles.top}>
                <div>
                    <h1 id="current-place" className={styles.place}>
                        {place.name}
                    </h1>
                    <p className={styles.details}>{placeDetails(place)}</p>
                    <p className={styles.time}>
                        {format.longDate(current.time)} · {t.localTime(format.time(current.time))}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.favorite}
                    aria-pressed={isFavorite}
                    aria-label={favoriteLabel}
                    title={favoriteLabel}
                    onClick={onToggleFavorite}
                >
                    <StarIcon filled={isFavorite} size={22} />
                </button>
            </div>

            <div className={styles.main}>
                <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={128} animated />
                <div>
                    <p className={styles.temperature}>{format.temperature(current.temperature)}</p>
                    <p className={styles.condition}>{weatherLabel(t, current.weatherCode)}</p>
                    <p className={styles.range}>
                        <span>{t.high(format.temperature(today.max))}</span>
                        <span>{t.low(format.temperature(today.min))}</span>
                        <span>{t.feelsLikeValue(format.temperature(current.feelsLike))}</span>
                    </p>
                </div>
            </div>
        </section>
    )
}
