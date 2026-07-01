async function fetchPokemonList() {
    const response = await fetch(`${BASE_URL}pokemon?limit=20&offset=0`);   //? means from now on the variables are coming. and = &. start from zero and go for next 20.
    const data = await response.json();


    const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return await response.json();
        })
    );

    return pokemonDetails;
}