import type { ReactNode } from 'react'
import { useI18n } from '../i18n/useI18n'
import { samePlace } from '../lib/placeUrl'
import type { Place } from '../types'
import { ClockIcon, CloseIcon, StarIcon } from './Icons'
import styles from './PlaceChips.module.css'

interface PlaceChipsProps {
    favorites: Place[]
    recents: Place[]
    current?: Place
    onSelect: (place: Place) => void
    onClearRecents: () => void
}

// Quick access to saved and recently viewed places
export function PlaceChips({
    favorites,
    recents,
    current,
    onSelect,
    onClearRecents,
}: PlaceChipsProps) {
    const { t } = useI18n()
    const otherRecents = recents.filter(
        (recent) => !favorites.some((favorite) => samePlace(favorite, recent)),
    )
    if (favorites.length === 0 && otherRecents.length === 0) return null

    const chip = (place: Place, icon: ReactNode) => (
        <li key={place.id}>
            <button
                type="button"
                className={styles.chip}
                aria-current={current && samePlace(place, current) ? 'true' : undefined}
                onClick={() => onSelect(place)}
            >
                {icon}
                {place.name}
            </button>
        </li>
    )

    return (
        <nav className={styles.chips} aria-label={t.savedPlaces}>
            <ul>
                {favorites.map((place) => chip(place, <StarIcon size={14} filled />))}
                {otherRecents.map((place) => chip(place, <ClockIcon size={14} />))}
            </ul>
            {otherRecents.length > 0 && (
                <button
                    type="button"
                    className={styles.clear}
                    onClick={onClearRecents}
                    aria-label={t.clearRecents}
                    title={t.clearRecents}
                >
                    <CloseIcon size={14} />
                </button>
            )}
        </nav>
    )
}
