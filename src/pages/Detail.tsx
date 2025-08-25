import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCountryDetail } from '../hooks/useCountry';

function Detail() {
    const { code } = useParams<{ code: string }>();
    const { country, loading, error, getCountryDetail } = useCountryDetail();
    const lastIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!code) return;
        if (lastIdRef.current === code) return;
        lastIdRef.current = code;
        void getCountryDetail(code);
    }, [code, getCountryDetail]);

    if (loading) return <p>Loading…</p>;
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