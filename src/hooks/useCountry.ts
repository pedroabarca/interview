import type {Country, CountryDetail} from "../types/country.ts";
import {useCallback, useEffect, useState} from "react";
import {fetchCountries, fetchCountryDetail} from "../services/countryService.ts";

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