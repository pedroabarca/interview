import type { RestCountryDto, RestCountryDetailDto } from '../types/country'
import { makeFetchResponse, getFetchMock } from '../test/mocks/fetch'
import {fetchCountries, fetchCountryDetail} from "./countryService.ts";

describe('countryService', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.clearAllMocks()
    })

    describe('getCountries', () => {
        it('maps and sorts countries alphabetically', async () => {
            const raw: RestCountryDto[] = [
                {
                    cca3: 'USA',
                    name: { common: 'United States' },
                    region: 'Americas',
                    flags: { svg: 'https://flagcdn.com/us.svg' },
                },
                {
                    cca3: 'CRI',
                    name: { common: 'Costa Rica' },
                    region: 'Americas',
                    flags: { svg: 'https://flagcdn.com/cr.svg' },
                },
            ]

            const fetchMock = getFetchMock()
            fetchMock.mockResolvedValueOnce(makeFetchResponse(raw))

            const list = await fetchCountries()

            expect(fetchMock).toHaveBeenCalledTimes(1)
            expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/all?fields=')

            const names = list.map(c => c.name)
            expect(names).toEqual(['United States','Costa Rica'])

            const cr = list[0]
            expect(cr.code).toBe('USA')
            expect(cr.region).toBe('Americas')
            expect(typeof cr.flag).toBe('string')
        })

        it('throws on HTTP error', async () => {
            const fetchMock = getFetchMock()
            fetchMock.mockResolvedValueOnce(makeFetchResponse([], /* ok */ false, /* status */ 500))

            await expect(fetchCountries()).rejects.toThrow('Network response was not ok')
        })
    })

    describe('fetchCountry', () => {
        it('requests /alpha/{code}?fields=... and maps detail', async () => {
            const raw: RestCountryDetailDto = {
                cca3: 'CRI',
                name: { common: 'Costa Rica' },
                region: 'Americas',
                capital: ['San José'],
                population: 5_094_118,
                languages: { spa: 'Spanish' },
                currencies: { CRC: { name: 'Costa Rican colón', symbol: '₡' } },
                timezones: ['UTC-06:00'],
                flags: { svg: 'https://flagcdn.com/cr.svg' },
                maps: {
                    googleMaps: 'https://maps.google.com/?q=costa+rica',
                    openStreetMaps: 'https://www.openstreetmap.org/relation/287667',
                },
            }

            const fetchMock = getFetchMock()
            fetchMock.mockResolvedValueOnce(makeFetchResponse(raw))

            const dto = await fetchCountryDetail('CRI')

            expect(fetchMock).toHaveBeenCalledTimes(1)
            const urlArg = String(fetchMock.mock.calls[0]?.[0])
            expect(urlArg).toContain('/alpha/CRI?fields=')

            expect(dto.code).toBe('CRI')
            expect(dto.name).toBe('Costa Rica')
            expect(dto.region).toBe('Americas')
            expect(dto.capital[0]).toMatch(/San José|San Jose/i)
            expect(dto.population).toBeGreaterThan(0)
            expect(Object.values(dto.languages)).toContain('Spanish')
            expect(Object.keys(dto.currencies)).toContain('CRC')
            expect(dto.flag).toContain('cr.svg')
            expect(dto.maps.googleMaps).toBe(raw.maps!.googleMaps)
            expect(dto.timezones[0]).toMatch(/UTC/i)
        })

        it('accepts array payloads from REST Countries', async () => {
            const rawArr: RestCountryDetailDto[] = [
                {
                    cca3: 'CRI',
                    name: { common: 'Costa Rica' },
                    region: 'Americas',
                    capital: ['San José'],
                    population: 5_094_118,
                    flags: { png: 'https://flagcdn.com/cr.png' },
                },
            ]

            const fetchMock = getFetchMock()
            fetchMock.mockResolvedValueOnce(makeFetchResponse(rawArr))

            const dto = await fetchCountryDetail('CRI')
            expect(dto.code).toBe('CRI')
            expect(dto.name).toBe('Costa Rica')
            expect(dto.flag).toContain('cr.')
        })

        it('throws on HTTP error', async () => {
            const fetchMock = getFetchMock()
            fetchMock.mockResolvedValueOnce(makeFetchResponse({}, /* ok */ false, /* status */ 404))

            await expect(fetchCountryDetail('XXX')).rejects.toThrow('Network response was not ok')
        })
    })
})