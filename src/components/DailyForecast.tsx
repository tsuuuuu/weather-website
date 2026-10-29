import { useI18n } from '../i18n/useI18n'
import { uvLevel } from '../lib/format'
import { weatherLabel } from '../lib/weatherCodes'
import type { Forecast } from '../types'
import { DropletIcon } from './Icons'
import { WeatherIcon } from './WeatherIcon'
import styles from './DailyForecast.module.css'

interface DailyForecastProps {
    forecast: Forecast
    selectedDay: number
    onSelectDay: (index: number) => void
}

export function DailyForecast({ forecast, selectedDay, onSelectDay }: DailyForecastProps) {
    const { t, format } = useI18n()
    const { daily, current, units } = forecast
    // Temperature bars share one scale across the week
    const weekMin = Math.min(...daily.map((day) => day.min))
    const weekRange = Math.max(...daily.map((day) => day.max)) - weekMin || 1
    const position = (value: number) => ((value - weekMin) / weekRange) * 100

    return (
        <section className={`card ${styles.daily}`} aria-labelledby="daily-title">
            <h2 id="daily-title" className="card-title">
                {t.sevenDay}
            </h2>
            <ul className={styles.list}>
                {daily.map((day, index) => {
                    const selected = index === selectedDay
                    const detailsId = `day-details-${index}`
                    return (
                        <li key={day.date}>
                            <button
                                type="button"
                                className={styles.row}
                                aria-expanded={selected}
                                aria-controls={detailsId}
                                onClick={() => onSelectDay(index)}
                            >
                                <span className={styles.day}>
                                    {index === 0 ? t.today : format.weekdayShort(day.date)}
                                </span>
                                <WeatherIcon code={day.weatherCode} size={32} />
                                <span className={styles.rain}>
                                    {day.precipitationChance >= 10 &&
                                        format.percent(day.precipitationChance)}
                                </span>
                                <span className={styles.min}>{format.temperature(day.min)}</span>
                                <span className={styles.bar} aria-hidden="true">
                                    <span
                                        className={styles.range}
                                        style={{
                                            left: `${position(day.min)}%`,
                                            right: `${100 - position(day.max)}%`,
                                        }}
                                    />
                                    {index === 0 && (
                                        <span
                                            className={styles.now}
                                            style={{ left: `${position(current.temperature)}%` }}
                                        />
                                    )}
                                </span>
                                <span className={styles.max}>{format.temperature(day.max)}</span>
                            </button>

                            {selected && (
                                <dl className={styles.details} id={detailsId}>
                                    <div>
                                        <dt>{t.conditions}</dt>
                                        <dd>{weatherLabel(t, day.weatherCode)}</dd>
                                    </div>
                                    <div>
                                        <dt>{t.precipitation}</dt>
                                        <dd>
                                            <DropletIcon size={13} />{' '}
                                            {format.precipitation(day.precipitationSum, units)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>{t.maxWind}</dt>
                                        <dd>{format.wind(day.windSpeedMax, units)}</dd>
                                    </div>
                                    <div>
                                        <dt>{t.uvIndex}</dt>
                                        <dd>
                                            {format.integer(day.uvIndexMax)} ·{' '}
                                            {t.uvLevels[uvLevel(day.uvIndexMax)]}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>{t.sunrise}</dt>
                                        <dd>{format.time(day.sunrise)}</dd>
                                    </div>
                                    <div>
                                        <dt>{t.sunset}</dt>
                                        <dd>{format.time(day.sunset)}</dd>
                                    </div>
                                </dl>
                            )}
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
