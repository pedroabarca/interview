// Basic information about a country for listing (used in Home page)
export type Country = {
    code: string;
    name: string;
    region: string;
    flag: string;
};

// Detailed information about a country (used in Country Detail page)
export type CountryDetail = {
    code: string;
    name: string;
    region: string;
    capital: string[];
    population: number;
    languages: Record<string, string>;
    currencies: Record<string, { name: string; symbol?: string }>;
    timezones: string[];
    flag: string;
    maps: { googleMaps?: string; openStreetMaps?: string };
};

// Types representing the raw data structure returned by the REST Countries API
export type RestCountryDto = {
    cca3: string;
    name: { common: string; official?: string };
    region?: string;
    capital?: string[];
    population?: number;
    flags?: { svg?: string; png?: string };
};


// Detailed country data structure returned by the REST Countries API
export type RestCountryDetailDto = {
    cca3: string;
    name?: { common?: string };
    region?: string;
    capital?: string[];
    population?: number;
    languages?: Record<string, string>;
    currencies?: Record<string, { name: string; symbol?: string }>;
    timezones?: string[];
    flags?: { svg?: string; png?: string };
    maps?: { googleMaps?: string; openStreetMaps?: string };
};