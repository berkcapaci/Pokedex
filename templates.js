function getPokemonCardTemplate(pokemon){
    const firstColor = typeColors[pokemon.types[0].type.name];
    let cardBackground ;

    if (pokemon.types.length > 1){
        const secondColor = typeColors[pokemon.types[1].type.name];
        cardBackground = `linear-gradient(${firstColor}, ${secondColor})`;
    } else {
        cardBackground = firstColor;
    }
    return`
        <div class="pokemon-card" style="background:${cardBackground}">
            <div class="pokemon-header">
                <span class="pokemon-id">#${pokemon.id}</span>
                <h2>${pokemon.name}</h2>
            </div>
            <img class="pokemon-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
            <div class="pokemon-types">
                ${getPokemonTypesTemplate(pokemon.types)}
            </div>
        </div>
    `;
}

function getPokemonTypesTemplate(types){
    return types.map((type) => {
            const typeName = type.type.name
            const formattedType = `${typeName.charAt(0).toUpperCase()}${typeName.slice(1)}`;
            return`
                <span style="background-color:${typeColors[typeName]}">${formattedType}</span>
            `;
    }).join("");
}

