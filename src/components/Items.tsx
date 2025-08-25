import type {Country} from "../types/country.ts";
import {Link} from "react-router-dom";

function ItemList({countries}: {countries: Country[]}) {
    return(
        <ul className="items">
            {countries.map((country: Country) => (
                <li className="item" key={country.code}>
                    <h5>{country.name}</h5>
                    <Link to={`/countries/${country.code}`}>
                        {country.flag && (
                            <div className="flagWrap">
                                <img
                                    src={country.flag}
                                    alt={country.name}
                                    decoding="auto"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

function ItemEmpty() {
    return <p>No Countries available.</p>;
}

export function Items({countries}: {countries: Country[]}) {
    return (
        <div>
            {countries.length > 0 ? <ItemList countries={countries} /> : <ItemEmpty />}
        </div>
    )
}