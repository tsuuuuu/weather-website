import { useI18n } from '../i18n/useI18n'
import { weatherKind, weatherLabel } from '../lib/weatherCodes'
import styles from './WeatherIcon.module.css'

interface WeatherIconProps {
    code: number
    isDay?: boolean
    size?: number
    // Animate the icon (only the large current-conditions icon does)
    animated?: boolean
}

const Sun = ({ cx = 32, cy = 32, r = 11 }) => (
    <g className={styles.sun}>
        <g className={styles.rays} style={{ transformOrigin: `${cx}px ${cy}px` }}>
            {Array.from({ length: 8 }, (_, i) => (
                <line
                    key={i}
                    x1={cx}
                    y1={cy - r - 5}
                    x2={cx}
                    y2={cy - r - 10}
                    transform={`rotate(${i * 45} ${cx} ${cy})`}
                />
            ))}
        </g>
        <circle cx={cx} cy={cy} r={r} />
    </g>
)

const Moon = ({ cx = 32, cy = 30 }) => (
    <path
        className={styles.moon}
        d={`M${cx + 6} ${cy - 15}a15 15 0 1 0 10 22a12 12 0 0 1-10-22Z`}
    />
)

const Cloud = ({ dark = false, dx = 0, dy = 0, scale = 1 }) => (
    <path
        className={dark ? styles.cloudDark : styles.cloud}
        transform={`translate(${dx} ${dy}) scale(${scale})`}
        d="M19 50h28a11 11 0 0 0 0-22 15 15 0 0 0-28.6 4.2A9 9 0 0 0 19 50Z"
    />
)

const Drops = ({ count = 3 }) => (
    <g className={styles.drops}>
        {[22, 32, 42, 27, 37].slice(0, count).map((x, i) => (
            <line
                key={i}
                x1={x}
                y1={54}
                x2={x - 2}
                y2={60}
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
    </g>
)

const Flakes = () => (
    <g className={styles.flakes}>
        {[22, 32, 42].map((x, i) => (
            <circle key={x} cx={x} cy={57} r={2} style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
    </g>
)

const FogLines = () => (
    <g className={styles.fogLines}>
        <line x1={14} y1={54} x2={50} y2={54} />
        <line x1={20} y1={60} x2={46} y2={60} />
    </g>
)

const Bolt = () => <path className={styles.bolt} d="M33 48h-6l5-10h6l-3 6h5l-9 14Z" />

export function WeatherIcon({ code, isDay = true, size = 48, animated = false }: WeatherIconProps) {
    const { t } = useI18n()
    const kind = weatherKind(code)
    const label = weatherLabel(t, code)
    const celestial = isDay ? <Sun cx={24} cy={24} r={9} /> : <Moon cx={22} cy={24} />

    let content
    switch (kind) {
        case 'clear':
            content = isDay ? <Sun /> : <Moon />
            break
        case 'partly-cloudy':
            content = (
                <>
                    {celestial}
                    <Cloud dx={6} dy={4} scale={0.9} />
                </>
            )
            break
        case 'cloudy':
            content = (
                <>
                    <Cloud dark dx={10} dy={-8} scale={0.75} />
                    <Cloud />
                </>
            )
            break
        case 'fog':
            content = (
                <>
                    <Cloud dy={-4} />
                    <FogLines />
                </>
            )
            break
        case 'drizzle':
            content = (
                <>
                    <Cloud dy={-4} />
                    <Drops count={2} />
                </>
            )
            break
        case 'rain':
            content = (
                <>
                    <Cloud dy={-4} />
                    <Drops count={3} />
                </>
            )
            break
        case 'heavy-rain':
            content = (
                <>
                    <Cloud dark dy={-4} />
                    <Drops count={5} />
                </>
            )
            break
        case 'snow':
            content = (
                <>
                    <Cloud dy={-4} />
                    <Flakes />
                </>
            )
            break
        case 'storm':
            content = (
                <>
                    <Cloud dark dy={-6} />
                    <Bolt />
                </>
            )
            break
    }

    return (
        <svg
            className={animated ? `${styles.icon} ${styles.animated}` : styles.icon}
            viewBox="0 0 64 64"
            width={size}
            height={size}
            role="img"
            aria-label={label}
        >
            {content}
        </svg>
    )
}
