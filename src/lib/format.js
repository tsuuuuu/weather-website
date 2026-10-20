const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const temperature = (celsius) => `${Math.round(celsius * 10) / 10}°C`

export const percent = (value) => `${Math.round(value ?? 0)}%`

export const millimeters = (value) => `${Math.round((value ?? 0) * 10) / 10}mm`

// Open-Meteo returns local dates as "YYYY-MM-DD"; parse them as UTC so the
// server's own timezone can't shift the day
const parseDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day))
}

// "2026-10-20" -> "20/10"
export const dayMonth = (isoDate) => {
    const [, month, day] = isoDate.split('-')
    return `${day}/${month}`
}

// "2026-10-20" -> "Ter"
export const weekday = (isoDate) => WEEKDAYS[parseDate(isoDate).getUTCDay()]
