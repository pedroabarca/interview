import { useEffect, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type {Country} from "../../types/country.ts";
import { fetchCountriesByName } from '../../services/countryService.ts'

export function useCountrySearch(name: string) {
  // debounce the name input to avoid excessive API calls
  const [debounced, setDebounced] = useState(name);

  // Update debounced value after a delay when name changes
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(name.trim()), 250);
    return () => clearTimeout(timeout);
  }, [name]);

  return useQuery<Country[]>({
    queryKey: ['countries', 'search', debounced],
    queryFn: () => fetchCountriesByName(debounced),
    enabled: debounced.length >= 2, // only run when 2+ chars
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: (count, err: unknown) =>
      err instanceof Error && /404/.test(err.message) ? false : count < 2,
  });
}