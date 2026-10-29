import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { usePlaceSearch } from '../hooks/usePlaceSearch'
import { useI18n } from '../i18n/useI18n'
import { placeDetails } from '../lib/format'
import type { Place } from '../types'
import { LocateIcon, SearchIcon } from './Icons'
import styles from './SearchBox.module.css'

interface SearchBoxProps {
    onSelect: (place: Place) => void
    onLocate: () => void
    locating: boolean
}

// City search with autocomplete (ARIA combobox pattern) and a "use my location" button
export function SearchBox({ onSelect, onLocate, locating }: SearchBoxProps) {
    const { t, language } = useI18n()
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const listId = useId()
    const { results, loading, failed } = usePlaceSearch(query, language)

    const showList = open && query.trim().length >= 2

    const choose = (place: Place) => {
        onSelect(place)
        setQuery('')
        setOpen(false)
        setActiveIndex(-1)
        inputRef.current?.blur()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
            setActiveIndex((i) => Math.min(i + 1, results.length - 1))
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, 0))
        } else if (event.key === 'Enter') {
            event.preventDefault()
            const place = results[activeIndex] ?? results[0]
            if (place) choose(place)
        } else if (event.key === 'Escape') {
            setOpen(false)
            setActiveIndex(-1)
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.field} role="search">
                <SearchIcon className={styles.searchIcon} size={18} />
                <input
                    ref={inputRef}
                    className={styles.input}
                    type="text"
                    placeholder={t.searchPlaceholder}
                    aria-label={t.searchPlaceholder}
                    role="combobox"
                    aria-expanded={showList}
                    aria-controls={listId}
                    aria-autocomplete="list"
                    aria-activedescendant={
                        showList && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
                    }
                    autoComplete="off"
                    spellCheck={false}
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value)
                        setOpen(true)
                        setActiveIndex(-1)
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    type="button"
                    className={styles.locate}
                    onClick={onLocate}
                    disabled={locating}
                    aria-label={t.useMyLocation}
                    title={t.useMyLocation}
                >
                    <LocateIcon size={18} className={locating ? styles.spinning : undefined} />
                </button>
            </div>

            {showList && (
                <ul
                    className={styles.list}
                    id={listId}
                    role="listbox"
                    aria-label={t.matchingPlaces}
                >
                    {results.map((place, index) => (
                        <li
                            key={place.id}
                            id={`${listId}-${index}`}
                            role="option"
                            aria-selected={index === activeIndex}
                            className={styles.option}
                            // mousedown fires before the input's blur closes the list
                            onMouseDown={(event) => {
                                event.preventDefault()
                                choose(place)
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <span className={styles.optionName}>{place.name}</span>
                            <span className={styles.optionDetails}>{placeDetails(place)}</span>
                        </li>
                    ))}
                    {loading && results.length === 0 && (
                        <li className={styles.status}>{t.searching}</li>
                    )}
                    {!loading && failed && (
                        <li className={styles.status}>{t.errors.searchUnavailable}</li>
                    )}
                    {!loading && !failed && results.length === 0 && (
                        <li className={styles.status}>{t.noPlaces}</li>
                    )}
                </ul>
            )}
        </div>
    )
}
