import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import type {Country} from "../types/country";
import {Items} from "../components/Items.tsx";
import { useCountrySearch } from "../hooks/countrySearch/useCountrySearch";
import { useCountry } from "../hooks/countries/useCountry";
import { useSort } from "../hooks/sort/useSort";

function Home() {
    // Get theme and toggle function from context
    const { theme, toggleTheme } = useTheme();

    // Get all countries from the custom hook
    const { countries: allCountries, loading: loadingAll, error: errorAll } = useCountry();
    // State to manage the search query
    const [query, setQuery] = useState('');

    // Get searched countries from the custom hook
    const {
        data: searched = [],
        isLoading: loadingSearch,
        isError: isSearchError,
        error: searchErr,
    } = useCountrySearch(query)

    // State to manage the input value (controlled component)
    const [sortOn, setSortOn] = useState(false);

    // Boolean to determine if we are using search
    const usingSearch = query.trim().length >= 2;

    // decide which list to show the whole list or the searched list
    const baseList: Country[] = usingSearch ? searched : allCountries;
    // sort the list if sortOn is true
    const list = useSort(baseList, sortOn);

    // decide which loading and error states to use if searching or not
    const loading = usingSearch ? loadingSearch : loadingAll;
    const error = usingSearch
        ? (isSearchError ? (searchErr as Error)?.message ?? 'Search error' : null)
        : errorAll

    return (
        <div className="page">
            <header>
                <h1>Search Countries</h1>
                <div className="controls">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search country by name… Costa Rica"
                        aria-label="Search countries"
                        className="searchInput"
                    />

                    <label className="sortToggle">
                        <input
                            type="checkbox"
                            checked={sortOn}
                            onChange={(e) => setSortOn(e.target.checked)}
                        />
                        Sort by name
                    </label>
                    <button className="themeToggle" onClick={toggleTheme}>
                        {theme === 'dark' ? '☀️ Set Light Mode' : '🌙 Set Dark Mode' }
                    </button>
                </div>
            </header>

            <main>
                {loading && <p className="loading">Loading…</p>}
                {error && <p>Error: {error}</p>}
                {!loading && !error && <Items countries={list} />}
            </main>
        </div>
    )
}


export default Home;