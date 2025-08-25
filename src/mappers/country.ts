import type {Country, CountryDetail, RestCountryDetailDto, RestCountryDto} from '../types/country.ts'
const DEFAULT_FLAG_URL = 'https://www.pngmart.com/files/15/Blank-Flag-Vector-PNG.png';
export const toCountryDto = (country: RestCountryDto): Country => ({
    code: country.cca3,
        name: country.name?.common ?? country.cca3,
    region: country.region ?? 'Region not specified',
    flag: country.flags?.svg ?? country.flags?.png ?? DEFAULT_FLAG_URL,
});

export const toCountryDetailDto = (country: RestCountryDetailDto): CountryDetail => ({
    code: country.cca3,
    name: country.name?.common ?? 'Unknown',
    region: country.region ?? '—',
    capital: Array.isArray(country.capital) ? country.capital : [],
    population: typeof country.population === 'number' ? country.population : 0,
    languages: country.languages ?? {},
    currencies: country.currencies ?? {},
    timezones: Array.isArray(country.timezones) ? country.timezones : [],
    flag: country.flags?.svg ?? country.flags?.png ?? DEFAULT_FLAG_URL,
    maps: {
        googleMaps: country.maps?.googleMaps,
        openStreetMaps: country.maps?.openStreetMaps,
    },
});