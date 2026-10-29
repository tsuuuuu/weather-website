import { useLayoutEffect, useRef } from 'react'
import { useNow } from '../hooks/useNow'
import { useI18n } from '../i18n/useI18n'
import { localNow } from '../lib/format'
import type { Forecast, HourForecast } from '../types'
import { ClockIcon } from './Icons'
import { WeatherIcon } from './WeatherIcon'
import styles from './HourlyChart.module.css'

const HOURS_BEFORE_NOW = 12
const HOURS_AFTER_NOW = 24
const COLUMN = 56
// Vertical layout, top to bottom: "Now" label, temperatures and line, icons, rain, times
const LABEL_HEIGHT = 26
const LINE_TOP = LABEL_HEIGHT + 30
const LINE_BOTTOM = LABEL_HEIGHT + 92
const ICON_Y = LABEL_HEIGHT + 106
const RAIN_Y = LABEL_HEIGHT + 156
const TIME_Y = LABEL_HEIGHT + 182
const HEIGHT = LABEL_HEIGHT + 196

// Today: 12 hours back and 24 ahead of now. Other days: that day from midnight.
export function hoursForDay(forecast: Forecast, dayIndex: number): HourForecast[] {
    if (dayIndex === 0) {
        const start = Math.max(0, forecast.nowIndex - HOURS_BEFORE_NOW)
        return forecast.hourly.slice(start, forecast.nowIndex + HOURS_AFTER_NOW + 1)
    }
    const date = forecast.daily[dayIndex].date
    return forecast.hourly.filter((hour) => hour.time.startsWith(date))
}

// Horizontal position of a local time ("YYYY-MM-DDTHH:mm") on the chart, if it is shown
export function timePosition(hours: HourForecast[], time: string) {
    const index = hours.findIndex((hour) => hour.time.slice(0, 13) === time.slice(0, 13))
    if (index === -1) return undefined
    const minutes = Number(time.slice(14, 16))
    return index * COLUMN + COLUMN / 2 + (minutes / 60) * COLUMN
}

// Smooth curve through the points (Catmull-Rom converted to cubic Béziers)
function smoothPath(points: [number, number][]) {
    return points.reduce((path, [x, y], i) => {
        if (i === 0) return `M${x},${y}`
        const [x0, y0] = points[i - 2] ?? points[i - 1]
        const [x1, y1] = points[i - 1]
        const [x3, y3] = points[i + 1] ?? [x, y]
        const c1 = [x1 + (x - x0) / 6, y1 + (y - y0) / 6]
        const c2 = [x - (x3 - x1) / 6, y - (y3 - y1) / 6]
        return `${path} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x},${y}`
    }, '')
}

interface HourlyChartProps {
    forecast: Forecast
    dayIndex: number
}

export function HourlyChart({ forecast, dayIndex }: HourlyChartProps) {
    const { t, format } = useI18n()
    const now = useNow()
    const scrollerRef = useRef<HTMLDivElement>(null)

    const hours = hoursForDay(forecast, dayIndex)
    const temperatures = hours.map((hour) => hour.temperature)
    const min = Math.min(...temperatures)
    const range = Math.max(...temperatures) - min || 1
    const width = hours.length * COLUMN

    const points = hours.map((hour, i): [number, number] => [
        i * COLUMN + COLUMN / 2,
        LINE_BOTTOM - ((hour.temperature - min) / range) * (LINE_BOTTOM - LINE_TOP),
    ])
    const line = smoothPath(points)
    const area = `${line} L${points.at(-1)![0]},${LINE_BOTTOM + 8} L${points[0][0]},${LINE_BOTTOM + 8} Z`

    // The "now" marker, at the place's local time
    const nowX = timePosition(hours, localNow(forecast.utcOffsetSeconds, now))
    let nowY = 0
    if (nowX !== undefined) {
        const i = Math.min(Math.floor((nowX - COLUMN / 2) / COLUMN), points.length - 1)
        const [x1, y1] = points[Math.max(i, 0)]
        const [, y2] = points[Math.min(i + 1, points.length - 1)]
        nowY = y1 + (y2 - y1) * Math.max(0, (nowX - x1) / COLUMN)
    }

    // Center the marker when a forecast or day is shown, but not on every clock tick,
    // so the chart doesn't jump while someone is scrolling it
    const nowXRef = useRef(nowX)
    nowXRef.current = nowX
    useLayoutEffect(() => {
        const scroller = scrollerRef.current
        if (!scroller) return
        const x = nowXRef.current
        scroller.scrollLeft = x === undefined ? 0 : x - scroller.clientWidth / 2
    }, [forecast, dayIndex])

    const title =
        dayIndex === 0 ? t.hourlyTitle : t.hourlyDay(format.weekday(forecast.daily[dayIndex].date))

    return (
        <section className={`card ${styles.chart}`} aria-labelledby="hourly-title">
            <h2 id="hourly-title" className="card-title">
                <ClockIcon size={16} />
                {title}
            </h2>
            <div
                ref={scrollerRef}
                className={styles.scroller}
                tabIndex={0}
                aria-label={t.hourlyScrollable}
            >
                <svg
                    width={width}
                    height={HEIGHT}
                    viewBox={`0 0 ${width} ${HEIGHT}`}
                    role="img"
                    aria-label={hours
                        .map(
                            (hour) =>
                                `${format.hour(hour.time)} ${format.temperature(hour.temperature)}`,
                        )
                        .join(', ')}
                >
                    <defs>
                        <linearGradient id="hourly-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
                            <stop offset="1" stopColor="#fff" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {nowX !== undefined && (
                        <rect
                            className={styles.past}
                            x={0}
                            y={LABEL_HEIGHT}
                            width={nowX}
                            height={HEIGHT - LABEL_HEIGHT}
                            rx={8}
                        />
                    )}

                    <path d={area} fill="url(#hourly-area)" />
                    <path d={line} className={styles.line} />

                    {hours.map((hour, i) => {
                        const [x, y] = points[i]
                        const isPast = nowX !== undefined && x < nowX - COLUMN / 2
                        return (
                            <g key={hour.time} className={isPast ? styles.pastColumn : undefined}>
                                <circle cx={x} cy={y} r={3} className={styles.dot} />
                                <text x={x} y={y - 12} className={styles.temperature}>
                                    {format.temperature(hour.temperature)}
                                </text>
                                <foreignObject x={x - 14} y={ICON_Y} width={28} height={28}>
                                    <WeatherIcon
                                        code={hour.weatherCode}
                                        isDay={hour.isDay}
                                        size={28}
                                    />
                                </foreignObject>
                                {hour.precipitationChance >= 10 && (
                                    <text x={x} y={RAIN_Y} className={styles.rain}>
                                        {format.percent(hour.precipitationChance)}
                                    </text>
                                )}
                                <text x={x} y={TIME_Y} className={styles.time}>
                                    {format.hour(hour.time)}
                                </text>
                            </g>
                        )
                    })}

                    {nowX !== undefined && (
                        <g className={styles.now} data-testid="now-marker">
                            <line x1={nowX} y1={LABEL_HEIGHT - 4} x2={nowX} y2={TIME_Y - 18} />
                            <circle cx={nowX} cy={nowY} r={5.5} />
                            <rect x={nowX - 26} y={2} width={52} height={20} rx={10} />
                            <text x={nowX} y={16}>
                                {t.now}
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        </section>
    )
}
