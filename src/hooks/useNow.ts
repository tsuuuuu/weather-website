import { useEffect, useState } from 'react'

// The current time, refreshed every `intervalMs` so time markers keep moving
export function useNow(intervalMs = 60_000) {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), intervalMs)
        return () => window.clearInterval(timer)
    }, [intervalMs])

    return now
}
