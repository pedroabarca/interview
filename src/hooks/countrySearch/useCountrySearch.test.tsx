import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, afterEach, type MockedFunction } from 'vitest';
import { useCountrySearch } from './useCountrySearch';

// Mock the service
vi.mock('../../services/countryService', () => ({
    fetchCountriesByName: vi.fn(),
}));

import { fetchCountriesByName } from '../../services/countryService';
import type { Country } from '../../types/country';

const mockedFetch = fetchCountriesByName as MockedFunction<typeof fetchCountriesByName>;

// Utility: render hook with QueryClientProvider
function renderWithClient<T>(hook: () => T) {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return renderHook(hook, {
        wrapper: ({ children }) => (
            <QueryClientProvider client={client}>{children}</QueryClientProvider>
        ),
    });
}

afterEach(() => {
    vi.clearAllMocks();
});

describe('useCountrySearch', () => {

    it('fetches and returns countries when name length >= 2', async () => {
        const sample: Country[] = [
            { code: 'CRI', name: 'Costa Rica', region: 'Americas', flag: 'cr.svg' },
            { code: 'CIV', name: "Côte d'Ivoire", region: 'Africa', flag: 'ci.svg' },
        ];
        mockedFetch.mockResolvedValueOnce(sample);

        const { result } = renderWithClient(() => useCountrySearch('Co'));

        // Initially loading
        expect(result.current.isLoading).toBe(true);

        // Wait for fetch to resolve
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(sample);
        expect(mockedFetch).toHaveBeenCalledWith('Co');
    });

    it('does not fetch if name length < 2', async () => {
        const { result } = renderWithClient(() => useCountrySearch('a'));

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(mockedFetch).not.toHaveBeenCalled();
    });

    it('debounces the input before triggering search', async () => {
        const sample: Country[] = [
            { code: 'CRI', name: 'Costa Rica', region: 'Americas', flag: 'cr.svg' },
        ];
        mockedFetch.mockResolvedValueOnce(sample);

        const { result } = renderWithClient(() =>
            useCountrySearch('Co')
        );

        // Immediately after, query should be idle until debounce kicks in
        expect(result.current.isLoading).toBe(true);

        // Wait for fetch to resolve
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(sample);
        expect(mockedFetch).toHaveBeenCalledWith('Co');
    });

    it('disables retry when error message includes 404', async () => {
        mockedFetch.mockRejectedValueOnce(new Error('404 Not Found'));

        const { result } = renderWithClient(() => useCountrySearch('ZZZ'));

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(mockedFetch).toHaveBeenCalledTimes(1);
    });
});
