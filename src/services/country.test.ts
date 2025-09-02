import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { RestCountryDto, RestCountryDetailDto } from '../types/country';
import { makeFetchResponse, getFetchMock } from '../test/mocks/fetch';
import {
    fetchCountries,
    fetchCountryDetail,
    fetchCountriesByName,
} from './countryService';

describe('countryService', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    describe('fetchCountries', () => {
        it('maps countries (no implicit sort in service)', async () => {
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
            ];

            const fetchMock = getFetchMock();
            fetchMock.mockResolvedValueOnce(makeFetchResponse(raw));

            const list = await fetchCountries();

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/all?fields=');

            // Service maps; sorting (if any) is done in hooks/UI, so we assert mapping only.
            expect(list).toHaveLength(2);
            expect(list[0]).toMatchObject({
                code: 'USA',
                name: 'United States',
                region: 'Americas',
            });
            expect(list[1]).toMatchObject({
                code: 'CRI',
                name: 'Costa Rica',
                region: 'Americas',
            });
            expect(typeof list[0].flag).toBe('string');
        });

        it('throws on HTTP error', async () => {
            const fetchMock = getFetchMock();
            fetchMock.mockResolvedValueOnce(makeFetchResponse([], /* ok */ false, /* status */ 500));

            await expect(fetchCountries()).rejects.toThrow('Network response was not ok');
        });
    });

    describe('fetchCountryDetail', () => {
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
            };

            const fetchMock = getFetchMock();
            fetchMock.mockResolvedValueOnce(makeFetchResponse(raw));

            const dto = await fetchCountryDetail('CRI');

            expect(fetchMock).toHaveBeenCalledTimes(1);
            const urlArg = String(fetchMock.mock.calls[0]?.[0]);
            expect(urlArg).toContain('/alpha/CRI?fields=');

            expect(dto.code).toBe('CRI');
            expect(dto.name).toBe('Costa Rica');
            expect(dto.region).toBe('Americas');
            expect(dto.capital[0]).toMatch(/San José|San Jose/i);
            expect(dto.population).toBeGreaterThan(0);
            expect(Object.values(dto.languages)).toContain('Spanish');
            expect(Object.keys(dto.currencies)).toContain('CRC');
            expect(dto.flag).toContain('cr.svg');
            expect(dto.maps.googleMaps).toBe(raw.maps!.googleMaps);
            expect(dto.timezones[0]).toMatch(/UTC/i);
        });

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
            ];

            const fetchMock = getFetchMock();
            fetchMock.mockResolvedValueOnce(makeFetchResponse(rawArr));

            const dto = await fetchCountryDetail('CRI');

            expect(dto.code).toBe('CRI');
            expect(dto.name).toBe('Costa Rica');
            expect(dto.flag).toContain('cr.');
        });

        it('throws when code is missing', async () => {
            await expect(fetchCountryDetail('')).rejects.toThrow('Country code is required');
        });

        it('throws on HTTP error', async () => {
            const fetchMock = getFetchMock();
            fetchMock.mockResolvedValueOnce(makeFetchResponse({}, /* ok */ false, /* status */ 404));

            await expect(fetchCountryDetail('XXX')).rejects.toThrow('Network response was not ok');
        });
    });

    describe('fetchCountriesByName', () => {
        it('maps countries by name (partial match)', async () => {
            const raw: RestCountryDto[] = [
                {
                    cca3: 'CRI',
                    name: { common: 'Costa Rica' },
                    region: 'Americas',
                    flags: { svg: 'https://flagcdn.com/cr.svg' },
                },
                {
                    cca3: 'HRV',
                    name: { common: 'Croatia' },
                    region: 'Europe',
                    flags: { svg: 'https://flagcdn.com/hr.svg' },
                },
            ];

            const fetchMock = getFetchMock();
            fetchMock.mockResolvedValueOnce(makeFetchResponse(raw));

            const list = await fetchCountriesByName('Co');

            expect(fetchMock).toHaveBeenCalledTimes(1);
            const urlArg = String(fetchMock.mock.calls[0]?.[0]);
            expect(urlArg).toContain('/name/Co?fields=');

            expect(list).toHaveLength(2);
            expect(list[0]).toMatchObject({ code: 'CRI', name: 'Costa Rica' });
            expect(list[1]).toMatchObject({ code: 'HRV', name: 'Croatia' });
        });

        it('returns [] on 404 (no matches)', async () => {
            const fetchMock = getFetchMock();
            fetchMock.mockResolvedValueOnce(makeFetchResponse([], /* ok */ false, /* status */ 404));

            const list = await fetchCountriesByName('zzzz-nope');

            expect(list).toEqual([]);
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });

        it('throws on HTTP error', async () => {
            const fetchMock = getFetchMock();
            fetchMock.mockResolvedValueOnce(makeFetchResponse({}, /* ok */ false, /* status */ 500));

            await expect(fetchCountriesByName('USA')).rejects.toThrow('Network response was not ok');
        });

        it('throws when name is empty', async () => {
            await expect(fetchCountriesByName('')).rejects.toThrow('Country name is required');
        });
    });
});