import type {Country, CountryDetail} from "../../types/country.ts";
import {useCallback, useEffect, useState} from "react";
import {fetchCountries, fetchCountryDetail} from "../../services/countryService.ts";

// Custom hook to call the fetch and manage the list of countries
// It handles loading and error states as well.
// The getCountries is memoized using useCallback to prevent unnecessary re-fetching when the component re-renders.
// Was extracted from the Home page to keep it clean and focused on rendering(Applying separation of concerns principle).
export function useCountry() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCountries = useCallback(() => {
        setLoading(true);
        fetchCountries()
            .then(setCountries)
            .catch(err => setError(err.message || 'Error'))
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {getCountries()}, [getCountries]);

    return {getCountries: getCountries, countries: countries, loading, error}
}

// Custom hook to fetch detailed information about a specific country by its code.
// It also manages loading and error states.
// The getCountryDetail function is memoized using useCallback to prevent unnecessary re-fetching when the component re-renders.
// Was extracted from the Detail page to keep it clean and focused on rendering (Applying separation of concerns principle).
export const useCountryDetail = () => {
    const [country, setCountry] = useState<CountryDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getCountryDetail = useCallback(async (code: string) => {
        try {
            setLoading(true)
            const data: CountryDetail = await fetchCountryDetail(code)
            setCountry(data)
            setError(null)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Unexpected error')
        } finally {
            setLoading(false)
        }
    }, [])

    return { country: country, loading, error, getCountryDetail }
}
