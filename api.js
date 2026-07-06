async function fetchPokemonList(limit, offset) {
    const response = await fetch(`${BASE_URL}pokemon?limit=${limit}&offset=${offset}`);   //? means from now on the variables are coming. and = &. start from zero and go for next 20.
    const data = await response.json();


    const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return await response.json();
        })
    );

    return pokemonDetails;
}

async function fetchPokemonByName(name) {
    const response = await fetch(`${BASE_URL}pokemon/${name}`);
    const data = await response.json();

    return data;
}

async function fetchPokemonNames() {
    const response = await fetch(`${BASE_URL}pokemon?limit=2000`);
    const data = await response.json();

    return data.results;
}

async function fetchPokemonSpecies(url) {
    const response = await fetch(url);
    return await response.json();
}

async function fetchEvolutionChain(url) {
    const response = await fetch(url);
    return await response.json();
}