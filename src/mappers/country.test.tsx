import { describe, it, expect } from 'vitest'
import { toCountryDetailDto } from './country'
import type { RestCountryDetailDto } from '../types/country'
const DEFAULT_FLAG_URL = 'https://www.pngmart.com/files/15/Blank-Flag-Vector-PNG.png';

describe('toCountryDetailDto', () => {
    it('maps minimal payload with safe defaults', () => {
        const raw: RestCountryDetailDto = { cca3: 'XXX' }

        const dto = toCountryDetailDto(raw)

        expect(dto.code).toBe('XXX')
        expect(dto.name).toBe('Unknown')
        expect(dto.region).toBe('—')
        expect(dto.capital).toEqual([])
        expect(dto.population).toBe(0)
        expect(dto.languages).toEqual({})
        expect(dto.currencies).toEqual({})
        expect(dto.timezones).toEqual([])
        expect(dto.flag).toBe(DEFAULT_FLAG_URL)
        // maps keys exist but are undefined when not provided
        expect(dto.maps.googleMaps).toBeUndefined()
        expect(dto.maps.openStreetMaps).toBeUndefined()
    })

    it('prefers SVG flag and falls back to PNG', () => {
        const rawSvg: RestCountryDetailDto = {
            cca3: 'SVG',
            flags: { svg: 'https://flags.test/flag.svg', png: 'https://flags.test/flag.png' },
        }
        const dtoSvg = toCountryDetailDto(rawSvg)
        expect(dtoSvg.flag).toBe('https://flags.test/flag.svg')

        const rawPng: RestCountryDetailDto = {
            cca3: 'PNG',
            flags: { png: 'https://flags.test/only.png' },
        }
        const dtoPng = toCountryDetailDto(rawPng)
        expect(dtoPng.flag).toBe('https://flags.test/only.png')
    })

    it('passes map links when present', () => {
        const raw: RestCountryDetailDto = {
            cca3: 'MAP',
            maps: {
                googleMaps: 'https://maps.google.com/?q=test',
                openStreetMaps: 'https://www.openstreetmap.org/relation/123',
            },
        }
        const dto = toCountryDetailDto(raw)
        expect(dto.maps.googleMaps).toBe('https://maps.google.com/?q=test')
        expect(dto.maps.openStreetMaps).toBe('https://www.openstreetmap.org/relation/123')
    })
})
