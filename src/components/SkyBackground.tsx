import type { Sky } from '../lib/sky'
import styles from './SkyBackground.module.css'

// Full-screen animated sky behind the app; colors and effects follow the weather
export function SkyBackground({ sky }: { sky: Sky }) {
    return (
        <div className={styles.sky} data-theme={sky.theme} aria-hidden="true">
            <div className={styles.glow} />
            {sky.stars && <div className={styles.stars} />}
            {sky.effect === 'clouds' && <div className={styles.clouds} />}
            {sky.effect === 'fog' && <div className={styles.fog} />}
            {(sky.effect === 'rain' || sky.effect === 'drizzle' || sky.effect === 'storm') && (
                <div className={styles.rain} data-intensity={sky.effect} />
            )}
            {sky.effect === 'storm' && <div className={styles.lightning} />}
            {sky.effect === 'snow' && <div className={styles.snow} />}
            <div className={styles.vignette} />
        </div>
    )
}
