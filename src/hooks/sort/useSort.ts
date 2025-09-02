import { useMemo } from 'react'
import type { Country } from '../../types/country'

/**
 * Returns a sorted list of countries by name if sortOn is true.
 * Otherwise, returns the original list.
 */
export function useSort(list: Country[], sortOn: boolean) {
    return useMemo(() => {
        if (!sortOn) return list
        // create a new array to avoid mutating the original list
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }, [list, sortOn]);
}