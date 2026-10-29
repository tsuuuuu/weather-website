import type { ReactNode } from 'react'
import { useI18n } from '../i18n/useI18n'
import { compassIndex, uvLevel } from '../lib/format'
import type { Forecast } from '../types'
import {
    DropletIcon,
    EyeIcon,
    GaugeIcon,
    SunIcon,
    SunriseIcon,
    ThermometerIcon,
    UmbrellaIcon,
    WindIcon,
} from './Icons'
import styles from './Highlights.module.css'

interface TileProps {
    icon: ReactNode
    title: string
    value: ReactNode
    note?: ReactNode
}

const Tile = ({ icon, title, value, note }: TileProps) => (
    <li className={`card ${styles.tile}`}>
        <h3 className="card-title">
            {icon}
            {title}
        </h3>
        <p className={styles.value}>{value}</p>
        {note && <p className={styles.note}>{note}</p>}
    </li>
)

export function Highlights({ forecast }: { forecast: Forecast }) {
    const { t, format } = useI18n()
    const { current, units } = forecast
    const today = forecast.daily[0]
    const uvPercent = Math.min(current.uvIndex / 11, 1) * 100
    const feelsDifference = Math.round(current.feelsLike - current.temperature)

    return (
        <section aria-labelledby="highlights-title">
            <h2 id="highlights-title" className="visually-hidden">
                {t.highlights}
            </h2>
            <ul className={styles.grid}>
                <Tile
                    icon={<ThermometerIcon size={16} />}
                    title={t.feelsLike}
                    value={format.temperature(current.feelsLike)}
                    note={
                        feelsDifference === 0
                            ? t.feelsSame
                            : feelsDifference > 0
                              ? t.feelsWarmer
                              : t.feelsCooler
                    }
                />
                <Tile
                    icon={<DropletIcon size={16} />}
                    title={t.humidity}
                    value={format.percent(current.humidity)}
                    note={
                        current.humidity >= 70
                            ? t.humid
                            : current.humidity <= 30
                              ? t.dry
                              : t.comfortable
                    }
                />
                <Tile
                    icon={<WindIcon size={16} />}
                    title={t.wind}
                    value={format.wind(current.windSpeed, units)}
                    note={
                        <span className={styles.direction}>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                // Arrow points where the wind blows to (opposite its origin)
                                style={{ transform: `rotate(${current.windDirection + 180}deg)` }}
                            >
                                <path d="M12 3 18 19 12 15 6 19Z" fill="currentColor" />
                            </svg>
                            {t.windFrom(t.compass[compassIndex(current.windDirection)])}
                        </span>
                    }
                />
                <Tile
                    icon={<SunIcon size={16} />}
                    title={t.uvIndex}
                    value={
                        <>
                            {format.integer(current.uvIndex)}{' '}
                            <span className={styles.unit}>
                                {t.uvLevels[uvLevel(current.uvIndex)]}
                            </span>
                        </>
                    }
                    note={
                        <span className={styles.meter} aria-hidden="true">
                            <span style={{ left: `${uvPercent}%` }} />
                        </span>
                    }
                />
                <Tile
                    icon={<UmbrellaIcon size={16} />}
                    title={t.precipitation}
                    value={format.precipitation(today.precipitationSum, units)}
                    note={t.chanceToday(Math.round(today.precipitationChance))}
                />
                <Tile
                    icon={<GaugeIcon size={16} />}
                    title={t.pressure}
                    value={
                        <>
                            {format.integer(current.pressure)}{' '}
                            <span className={styles.unit}>hPa</span>
                        </>
                    }
                    note={t.atSeaLevel}
                />
                <Tile
                    icon={<EyeIcon size={16} />}
                    title={t.visibility}
                    value={format.visibility(current.visibilityMeters, units)}
                    note={current.visibilityMeters >= 10000 ? t.clearView : t.reducedVisibility}
                />
                <Tile
                    icon={<SunriseIcon size={16} />}
                    title={t.sunriseSunset}
                    value={format.time(today.sunrise)}
                    note={t.sunsetAt(format.time(today.sunset))}
                />
            </ul>
        </section>
    )
}
