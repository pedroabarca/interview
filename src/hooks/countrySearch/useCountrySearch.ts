import { useEffect, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type {Country} from "../../types/country.ts";
import { fetchCountriesByName } from '../../services/countryService.ts'

export function useCountrySearch(name: string) {
  // debounce the name input to avoid excessive API calls
  const [debounced, setDebounced] = useState(name);

  // Update debounced value after a delay when name changes
  // This prevents making API calls on every keystroke
  // Only triggers the search when the user pauses typing for 250ms
  // This improves performance and reduces unnecessary load on the API
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(name.trim()), 250);
    return () => clearTimeout(timeout);
  }, [name]);
  // The useQuery hook from react-query is used to manage the fetching, caching, and updating of the country data
  // It automatically handles loading and error states, retries, and caching based on the provided configuration
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