import { useTheme } from "../context/ThemeContext";
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCountryDetail } from '../hooks/countries/useCountry';

function Detail() {

    // Get theme and toggle function from context
    const { theme, toggleTheme } = useTheme();

    // Get the country code from the URL parameters
    const { code } = useParams<{ code: string }>();

    const { country, loading, error, getCountryDetail } = useCountryDetail();
    // Ref to store the last fetched country code to avoid redundant fetches
    const lastIdRef = useRef<string | null>(null);

    // Fetch country details when the code changes
    useEffect(() => {
        if (!code) return;
        if (lastIdRef.current === code) return;
        lastIdRef.current = code;
        void getCountryDetail(code);
    }, [code, getCountryDetail]);

    // Render loading, error, or country details
    if (loading) return <p className="loading">Loading…</p>;
    if (error) return <p>Error: {error}</p>;
    if (!country) return <p>No Country found</p>;
    const capital = country.capital[0] ?? '—';
    const population = country.population.toLocaleString();
    const languages = Object.values(country.languages).join(', ') || '—';
    const currencies =
        Object.values(country.currencies)
            .map(c => (c.symbol ? `${c.name} (${c.symbol})` : c.name))
            .join(', ') || '—';
    const timezones = country.timezones.join(', ') || '—';

    return (
        <div className="page country-detail">
            <button aria-label="Toggle theme" className="themeToggle" onClick={toggleTheme}>
                {theme === 'dark' ? '☀️ Set Light Mode' : '🌙 Set Dark Mode' }
            </button>
            <div className="flagBox">
                <img
                    className="flag"
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    loading="eager"
                    decoding="async"
                />
            </div>

            <h1 className="title">{country.name}</h1>

            <dl className="info">
                <dt>Region</dt><dd>{country.region}</dd>
                <dt>Capital</dt><dd>{capital}</dd>
                <dt>Population</dt><dd>{population}</dd>
                <dt>Languages</dt><dd>{languages}</dd>
                <dt>Currencies</dt><dd>{currencies}</dd>
                <dt>Timezones</dt><dd>{timezones}</dd>
            </dl>

            {(country.maps.googleMaps || country.maps.openStreetMaps) && (
                <div className="links">
                    {country.maps.googleMaps && (
                        <a className="link" href={country.maps.googleMaps} target="_blank" rel="noreferrer">
                            Google Maps
                        </a>
                    )}
                    {country.maps.openStreetMaps && (
                        <a className="link" href={country.maps.openStreetMaps} target="_blank" rel="noreferrer">
                            OpenStreetMap
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

export default Detail;