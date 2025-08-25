import type {CountryDetail, Country, RestCountryDto, RestCountryDetailDto} from "../types/country.ts";
import {toCountryDetailDto, toCountryDto} from "../mappers/country.ts";

const baseUrl = 'https://restcountries.com/v3.1';
export const fetchCountries = (): Promise<Country[]> => {
    const fields = [
        'name','cca3','region','flags'
    ].join(',')
    return fetch(`${baseUrl}/all?fields=${fields}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json() as Promise<RestCountryDto[]>
        })
        .then(countries => countries.map(toCountryDto));
}

export const fetchCountryDetail = async (code: string): Promise<CountryDetail> => {
    if (!code) {
        throw new Error('Country code is required');
    }
    const fields = [
        'name','cca3','region','capital','population',
        'languages','currencies','timezones','flags','maps'
    ].join(',')
    const response = await fetch(`${baseUrl}/alpha/${encodeURIComponent(code)}?fields=${fields}`)
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const rawData = (await response.json()) as RestCountryDetailDto | RestCountryDetailDto[];
    const rawCountry = Array.isArray(rawData) ? rawData[0] : rawData
    if (!rawCountry) throw new Error(`Country ${code} not found`)
    return toCountryDetailDto(rawCountry)
}