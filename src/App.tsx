import { useEffect, useState } from 'react'
import { ApiError } from './api/http'
import { reverseGeocode, searchPlaces } from './api/places'
import { AboutDialog } from './components/AboutDialog'
import { CurrentConditions } from './components/CurrentConditions'
import { DailyForecast } from './components/DailyForecast'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Highlights } from './components/Highlights'
import { HourlyChart } from './components/HourlyChart'
import { PlaceChips } from './components/PlaceChips'
import { SkyBackground } from './components/SkyBackground'
import { Welcome } from './components/Welcome'
import { useForecast } from './hooks/useForecast'
import { useStoredState } from './hooks/useStoredState'
import { I18nProvider } from './i18n/I18nProvider'
import type { Messages } from './i18n/en'
import { defaultUnitsFor } from './i18n/languages'
import { useI18n } from './i18n/useI18n'
import { placeFromUrl, placeToSearch, samePlace } from './lib/placeUrl'
import { pickSky } from './lib/sky'
import { readStored, STORAGE_KEYS, writeStored } from './lib/storage'
import type { Place, Units } from './types'
import styles from './App.module.css'

const MAX_RECENTS = 5

// A shared link wins over the last place viewed on this device
const initialPlace = () =>
    placeFromUrl(window.location.search) ??
    readStored<Place | undefined>(STORAGE_KEYS.lastPlace, undefined)

const getPosition = () =>
    new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10_000,
            maximumAge: 10 * 60_000,
        }),
    )

type ErrorKey = keyof Messages['errors']

export function App() {
    return (
        <I18nProvider>
            <WeatherApp />
        </I18nProvider>
    )
}

function WeatherApp() {
    const { t, format, language, locale } = useI18n()
    const [place, setPlace] = useState<Place | undefined>(initialPlace)
    // Until the user picks, units follow the region (°F in the US, °C elsewhere)
    const [units, setUnits] = useStoredState<Units>(STORAGE_KEYS.units, defaultUnitsFor(locale))
    const [favorites, setFavorites] = useStoredState<Place[]>(STORAGE_KEYS.favorites, [])
    const [recents, setRecents] = useStoredState<Place[]>(STORAGE_KEYS.recents, [])
    const [selectedDay, setSelectedDay] = useState(0)
    const [locating, setLocating] = useState(false)
    const [locateError, setLocateError] = useState<ErrorKey>()
    const [aboutOpen, setAboutOpen] = useState(false)
    const weather = useForecast(place, units)
    const forecast = 'forecast' in weather ? weather.forecast : undefined

    // Keep the address bar shareable and remember the place for the next visit
    useEffect(() => {
        if (!place) return
        writeStored(STORAGE_KEYS.lastPlace, place)
        window.history.replaceState(null, '', placeToSearch(place))
    }, [place])

    useEffect(() => {
        document.title =
            place && forecast
                ? `${place.name} · ${format.temperature(forecast.current.temperature)} | Hayashi Weather`
                : 'Hayashi Weather'
    }, [place, forecast, format])

    const selectPlace = (next: Place) => {
        setPlace(next)
        setSelectedDay(0)
        setLocateError(undefined)
        setRecents((list) =>
            [next, ...list.filter((item) => !samePlace(item, next))].slice(0, MAX_RECENTS),
        )
    }

    const locate = async () => {
        if (!('geolocation' in navigator)) {
            setLocateError('locationUnsupported')
            return
        }
        setLocating(true)
        setLocateError(undefined)
        try {
            const { coords } = await getPosition()
            const found = await reverseGeocode(coords.latitude, coords.longitude, locale).catch(
                (): Place => ({
                    // The forecast still works without a place name
                    id: `${coords.latitude.toFixed(3)},${coords.longitude.toFixed(3)}`,
                    name: t.myLocation,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }),
            )
            selectPlace(found)
        } catch (error) {
            setLocateError(error instanceof ApiError ? error.code : 'locationFailed')
        } finally {
            setLocating(false)
        }
    }

    // Suggested cities are searched by name so they come back in the user's language
    const showSuggestion = async (name: string) => {
        try {
            const [found] = await searchPlaces(name, language)
            if (found) selectPlace(found)
        } catch {
            setLocateError('searchUnavailable')
        }
    }

    const isFavorite = !!place && favorites.some((favorite) => samePlace(favorite, place))
    const toggleFavorite = () => {
        if (!place) return
        setFavorites((list) =>
            isFavorite ? list.filter((item) => !samePlace(item, place)) : [...list, place],
        )
    }

    const hour = new Date().getHours()
    const sky = forecast
        ? pickSky({
              weatherCode: forecast.current.weatherCode,
              isDay: forecast.current.isDay,
              time: forecast.current.time,
              sunrise: forecast.daily[0].sunrise,
              sunset: forecast.daily[0].sunset,
          })
        : pickSky({ weatherCode: 1, isDay: hour >= 6 && hour < 18 })

    return (
        <>
            <SkyBackground sky={sky} />
            <div className={styles.app}>
                <Header
                    units={units}
                    onUnitsChange={setUnits}
                    onSelectPlace={selectPlace}
                    onLocate={locate}
                    locating={locating}
                />

                <PlaceChips
                    favorites={favorites}
                    recents={recents}
                    current={place}
                    onSelect={selectPlace}
                    onClearRecents={() => setRecents([])}
                />

                <main className={styles.main} aria-busy={weather.status === 'loading'}>
                    {!place && (
                        <Welcome
                            onLocate={locate}
                            onSuggestion={showSuggestion}
                            locating={locating}
                            locateError={locateError && t.errors[locateError]}
                        />
                    )}

                    {place && locateError && (
                        <p className={styles.notice} role="alert">
                            {t.errors[locateError]}
                        </p>
                    )}

                    {place && weather.status === 'error' && (
                        <div className={`card ${styles.error}`} role="alert">
                            <p>{t.errors[weather.error ?? 'generic']}</p>
                            <button type="button" onClick={weather.retry}>
                                {t.tryAgain}
                            </button>
                        </div>
                    )}

                    {place && !forecast && weather.status === 'loading' && <Skeleton />}

                    {place && forecast && (
                        <div
                            className={styles.grid}
                            data-refreshing={weather.status === 'loading' || undefined}
                        >
                            <div className={styles.hero}>
                                <CurrentConditions
                                    place={place}
                                    forecast={forecast}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={toggleFavorite}
                                />
                            </div>
                            <div className={styles.daily}>
                                <DailyForecast
                                    forecast={forecast}
                                    selectedDay={selectedDay}
                                    onSelectDay={(index) =>
                                        setSelectedDay((current) => (current === index ? 0 : index))
                                    }
                                />
                            </div>
                            <div className={styles.hourly}>
                                <HourlyChart forecast={forecast} dayIndex={selectedDay} />
                            </div>
                            <div className={styles.highlights}>
                                <Highlights forecast={forecast} />
                            </div>
                        </div>
                    )}
                </main>

                <Footer onAbout={() => setAboutOpen(true)} />
            </div>
            <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
        </>
    )
}

function Skeleton() {
    const { t } = useI18n()
    return (
        <div className={styles.grid} aria-label={t.loadingForecast}>
            <div className={`card ${styles.hero} ${styles.skeleton}`} style={{ minHeight: 300 }} />
            <div className={`card ${styles.daily} ${styles.skeleton}`} style={{ minHeight: 460 }} />
            <div
                className={`card ${styles.hourly} ${styles.skeleton}`}
                style={{ minHeight: 260 }}
            />
        </div>
    )
}
