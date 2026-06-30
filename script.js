let allPokemon =[];

const pokemonContainer = document.getElementById('pokemon-container');

async function init(){
    allPokemon = await fetchPokemonList();

    console.log(allPokemon);
    renderPokemonCards();
    
}

function renderPokemonCards(){
    pokemonContainer.innerHTML = '';

    let content = '';

    allPokemon.forEach((pokemon) => {
        content += getPokemonCardTemplate(pokemon);
    });

    pokemonContainer.innerHTML = content;
}