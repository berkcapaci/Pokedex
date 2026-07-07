function getPokemonCardTemplate(pokemon, index) {
    const cardBackground = getPokemonBackground(pokemon);
    return `
        <div
            class="pokemon-card"
            onclick="openPokemonDialog(${index})"
            style="background:${cardBackground}">
            <div class="pokemon-header">
                <span class="pokemon-id">#${pokemon.id}</span>
                <h2>${pokemon.name}</h2>
            </div>
            <img
                class="pokemon-image"
                src="${pokemon.sprites.other["official-artwork"].front_default}"
                alt="${pokemon.name}"
            >
            <div class="pokemon-types">
                ${getPokemonTypesTemplate(pokemon.types)}
            </div>
        </div>
    `;
}

function getPokemonTypesTemplate(types) {
    return types.map((type) => {
        const typeName = type.type.name;
        const formattedType =
            `${typeName.charAt(0).toUpperCase()}${typeName.slice(1)}`;
        return `
            <span style="background-color:${typeColors[typeName]}">
                ${formattedType}
            </span>
        `;
    }).join("");
}

function getPokemonDialogTemplate(pokemon, index, showNavigation = true) {
    const dialogBackground = getPokemonBackground(pokemon);
    const isFirstPokemon = index === 0;
    const isLastPokemon = index === displayedPokemon.length - 1;
    return `
        <div
            class="pokemon-dialog-content"
            style="background:${dialogBackground}">

            <div class="dialog-header">
                <div>
                    <h2>${pokemon.name}</h2>
                    <span class="pokemon-id">#${pokemon.id}</span>
                </div>
                <button
                    class="close-button"
                    onclick="closePokemonDialog()">
                    &times;
                </button>
            </div>
            <div class="dialog-image">
                <img
                    class="pokemon-image"
                    src="${pokemon.sprites.other["official-artwork"].front_default}"
                    alt="${pokemon.name}">
            </div>
            <div class="dialog-types">
                ${getPokemonTypesTemplate(pokemon.types)}
            </div>
            ${showNavigation ? `
                <div class="dialog-navigation">
                    <button
                        onclick="showPreviousPokemon()"
                        ${isFirstPokemon ? "disabled" : ""}>
                        Previous
                    </button>
                    <button
                        onclick="showNextPokemon()"
                        ${isLastPokemon ? "disabled" : ""}>
                        Next
                    </button>
                </div>
            ` : ""}
            <div class="dialog-tabs">
                <button
                    id="about-tab"
                    class="tab-button active"
                    onclick="showAbout()">
                    About
                </button>
                <button
                    id="stats-tab"
                    class="tab-button"
                    onclick="showStats()">
                    Base Stats
                </button>
                <button
                    id="evolution-tab"
                    class="tab-button"
                    onclick="showEvolution()">
                    Evolution
                </button>
            </div>
            <div id="dialog-content">
                ${getAboutTemplate(pokemon)}
            </div>
        </div>
    `;
}

function getPokemonBackground(pokemon) {
    const firstColor = typeColors[pokemon.types[0].type.name];
    if (pokemon.types.length > 1) {
        const secondColor = typeColors[pokemon.types[1].type.name];
        return `linear-gradient(${firstColor}, ${secondColor})`;
    }
    return firstColor;
}

function formatHeight(height) {
    return `${(height / 10).toFixed(1)} m`;
}

function formatWeight(weight) {
    return `${(weight / 10).toFixed(1)} kg`;
}

function getAboutTemplate(pokemon) {
    return `
        <p><strong>Height:</strong> ${formatHeight(pokemon.height)}</p>
        <p><strong>Weight:</strong> ${formatWeight(pokemon.weight)}</p>
    `;
}

function getStatsTemplate(pokemon) {
    return pokemon.stats.map((stat) => {
        const percentage = (stat.base_stat / 255) * 100;
        return `
            <div class="stat-row">
                <span class="stat-name">
                    ${formatStatName(stat.stat.name)}
                </span>
                <div class="stat-bar">
                    <div
                        class="stat-fill"
                        style="width:${percentage}%">
                    </div>
                </div>
                <span class="stat-value">
                    ${stat.base_stat}
                </span>
            </div>
        `;
    }).join("");
}

function formatStatName(statName) {
    switch (statName) {
        case "hp":
            return "HP";

        case "attack":
            return "Attack";

        case "defense":
            return "Defense";

        case "special-attack":
            return "Sp. Atk";

        case "special-defense":
            return "Sp. Def";

        case "speed":
            return "Speed";

        default:
            return statName;
    }
}

function getEvolutionTemplate(evolutionList) {
    return `
        <div class="evolution-list">

            ${evolutionList
                .map((pokemon, index) => {
                    const formattedName =
                        pokemon.name.charAt(0).toUpperCase() +
                        pokemon.name.slice(1);
                    return `
                        <div class="evolution-stage">
                            <img
                                class="evolution-image"
                                src="${pokemon.image}"
                                alt="${pokemon.name}">
                            <p>${formattedName}</p>
                        </div>
                    `;
                })
                .join("")}
        </div>
    `;
}

function getEmptyStateTemplate() {
    return `
        <div class="empty-state">
            <h2>Pokémon not found.</h2>
            <p>Try searching for another Pokémon.</p>
        </div>
    `;
}