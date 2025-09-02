import type {Country, CountryDetail, RestCountryDetailDto, RestCountryDto} from '../types/country.ts'

// A default flag image URL to use when no flag is available
const DEFAULT_FLAG_URL = 'https://www.pngmart.com/files/15/Blank-Flag-Vector-PNG.png';

// Map a RestCountryDto to a Country
// Here we provide default values for missing data to ensure the app remains robust
export const toCountryDto = (country: RestCountryDto): Country => ({
    code: country.cca3,
        name: country.name?.common ?? country.cca3,
    region: country.region ?? 'Region not specified',
    flag: country.flags?.svg ?? country.flags?.png ?? DEFAULT_FLAG_URL,
});

// Map a RestCountryDetailDto(data coming from the api) to a CountryDetail
// Here we provide default values for missing data to ensure the app remains robust
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