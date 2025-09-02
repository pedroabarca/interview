// src/hooks/useCountry.test.ts
import { renderHook, waitFor, act } from '@testing-library/react'
import { useCountry } from './useCountry'

vi.mock('../services/countryService', () => ({
    fetchCountries: vi.fn(),
    fetchCountryDetail: vi.fn(),
}))

import { fetchCountries } from '../../services/countryService'
import type { Country } from '../../types/country'
import type {MockedFunction} from "vitest";

const mockedFetchCountries = fetchCountries as MockedFunction<typeof fetchCountries>

afterEach(() => {
    vi.clearAllMocks()
})

describe('useCountry', () => {
    it('auto-fetches on mount and stores countries (success)', async () => {
        const sample: Country[] = [
            { code: 'CRI', name: 'Costa Rica', region: 'Americas', flag: 'https://flagcdn.com/cr.svg' },
            { code: 'USA', name: 'United States', region: 'Americas', flag: 'https://flagcdn.com/us.svg' },
        ]
        mockedFetchCountries.mockResolvedValueOnce(sample)

        const { result } = renderHook(() => useCountry())

        // 1) effect kicked in -> loading becomes true
        await waitFor(() => expect(result.current.loading).toBe(true))

        // 2) promise resolved -> loading false, data set, error cleared
        await waitFor(() => {
            expect(result.current.loading).toBe(false)
            expect(result.current.error).toBeNull()
            expect(result.current.countries).toEqual(sample)
        })

        expect(mockedFetchCountries).toHaveBeenCalledTimes(1)
    })

    it('sets error when service rejects', async () => {
        mockedFetchCountries.mockRejectedValueOnce(new Error('Network down'))

        const { result } = renderHook(() => useCountry())

        // first transition to loading = true
        await waitFor(() => expect(result.current.loading).toBe(true))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
            expect(result.current.countries).toEqual([])
            expect(result.current.error).toMatch(/network down/i)
        })

        expect(mockedFetchCountries).toHaveBeenCalledTimes(1)
    })

    it('manual refresh calls service again and updates list', async () => {
        mockedFetchCountries
            .mockResolvedValueOnce([{ code: 'CRI', name: 'Costa Rica', region: 'Americas', flag: 'cr' }])
            .mockResolvedValueOnce([{ code: 'USA', name: 'United States', region: 'Americas', flag: 'us' }])

        const { result } = renderHook(() => useCountry())


        await waitFor(() => expect(result.current.countries[0]?.code).toBe('CRI'))
        expect(mockedFetchCountries).toHaveBeenCalledTimes(1)


        await act(async () => {
            result.current.getCountries()
        })

        await waitFor(() => {
            expect(mockedFetchCountries).toHaveBeenCalledTimes(2)
            expect(result.current.countries[0]?.code).toBe('USA')
            expect(result.current.error).toBeNull()
        })
    })

    it('does not refetch on rerender (stable getCountries dependency)', async () => {
        mockedFetchCountries.mockResolvedValueOnce([{ code: 'CRI', name: 'Costa Rica', region: 'Americas', flag: 'cr' }])

        const { result, rerender } = renderHook(() => useCountry())

        await waitFor(() => expect(mockedFetchCountries).toHaveBeenCalledTimes(1))

        const firstGet = result.current.getCountries
        rerender()

        expect(result.current.getCountries).toBe(firstGet)
        expect(mockedFetchCountries).toHaveBeenCalledTimes(1)
    })
})
