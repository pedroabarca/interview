import type {CountryDetail, Country, RestCountryDto, RestCountryDetailDto} from "../types/country.ts";
import {toCountryDetailDto, toCountryDto} from "../mappers/country.ts";

const baseUrl = 'https://restcountries.com/v3.1';
// Detailed country information we want to get from the api (we don't want all fields)
// Reused in 2 functions bellow
const fields = [
    'name','cca3','region','flags'
].join(',')



// Fetch a list of all countries with minimal information
// Using Promises here just to demonstrate both styles.
export const fetchCountries = (): Promise<Country[]> => {

    return fetch(`${baseUrl}/all?fields=${fields}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json() as Promise<RestCountryDto[]>
        })
        .then(countries => countries.map(toCountryDto));
}


// Fetch detailed information about a country by its code (cca3)
// Using async/await here just to demonstrate both styles.
export const fetchCountryDetail = async (code: string): Promise<CountryDetail> => {
    if (!code) {
        throw new Error('Country code is required');
    }
    // Detailed country information we want to get from the api (we don't want all fields)
    const fields = [
        'name','cca3','region','capital','population',
        'languages','currencies','timezones','flags','maps'
    ].join(',')

    const response = await fetch(`${baseUrl}/alpha/${encodeURIComponent(code)}?fields=${fields}`)

    // if the response is not ok, throw an error
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    // Parse the JSON response as either a single object or an array
    const rawData = (await response.json()) as RestCountryDetailDto | RestCountryDetailDto[];

    // The API returns an array for this endpoint, even when searching by a single code, so we handle both cases
    const rawCountry = Array.isArray(rawData) ? rawData[0] : rawData

    // If no country is found, throw an error
    if (!rawCountry) throw new Error(`Country ${code} not found`);

    // Before returning, map the raw data to the CountryDetail type.
    // Basically, we are cleaning up the data here using the mapper function.
    return toCountryDetailDto(rawCountry);
}

// Fetch countries by country name (partial or full match) usying async/await
export const fetchCountriesByName = async (name: string): Promise<Country[]> => {
    if (!name) {
        throw new Error('Country name is required');
    }
    const response = await fetch(`${baseUrl}/name/${encodeURIComponent(name)}?fields=${fields}`);
    if (response.status === 404) return []
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const countries = await response.json() as RestCountryDto[];

    // Map the raw data to the Country type before returning, this cleans up data.
    return countries.map(toCountryDto);
}