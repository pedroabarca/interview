import {useCountry} from "../hooks/useCountry.ts";
import {Items} from "../components/Items.tsx";

function Home() {
    const { countries, loading, error } = useCountry()

    if (loading) return <p>Loading countries...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="page">
            <header>
                <h1>Countries</h1>
            </header>
            <main>
                <Items countries={countries}/>
            </main>
        </div>
    );
}

export default Home;