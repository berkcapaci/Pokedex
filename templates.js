function getPokemonCardTemplate(pokemon){
    return`
        <div class="pokemon-card">
            <div class="pokemon-header">
                <span class="pokemon-id">#${pokemon.id}</span>
                <h2>${pokemon.name}</h2>
            </div>
            <img class="pokemon-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
            <div class="pokemon-types">
                <span>Grass TBR </span>
                <span>Poison TBR </span>
            </div>
        </div>
    `;
}