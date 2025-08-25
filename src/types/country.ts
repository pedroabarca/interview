export type Country = {
    code: string;
    name: string;
    region: string;
    flag: string;
};
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

export type RestCountryDto = {
    cca3: string;
    name: { common: string; official?: string };
    region?: string;
    capital?: string[];
    population?: number;
    flags?: { svg?: string; png?: string };
};

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