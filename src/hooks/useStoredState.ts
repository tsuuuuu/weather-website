import { useEffect, useState } from 'react'
import { readStored, writeStored } from '../lib/storage'

// useState that is remembered in localStorage between visits
export function useStoredState<T>(key: string, fallback: T) {
    const [value, setValue] = useState<T>(() => readStored(key, fallback))

    useEffect(() => {
        writeStored(key, value)
    }, [key, value])

    return [value, setValue] as const
}
