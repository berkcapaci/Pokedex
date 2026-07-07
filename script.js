let allPokemon = [];
let displayedPokemon = [];
let pokemonList = [];
let currentPokemonIndex = 0;
let currentDialogPokemon = null;
let currentTab = "about";
let isLoading = false;

let limit = 20;
let offset = 0;

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchMessage = document.getElementById("search-message");
const loading = document.getElementById("loading");
const loadMoreButton = document.getElementById("load-more-button");
const pokemonContainer = document.getElementById("pokemon-container");
const pokemonDialog = document.getElementById("pokemon-dialog");

async function init() {
    pokemonDialog.addEventListener("click", closeDialogOnBackdrop);
    document.addEventListener("keydown", handleDialogKeyboardNavigation);
    initSearch();
    pokemonList = await fetchPokemonNames();
    await loadPokemon();
}

function closeDialogOnBackdrop(event) {
    if (event.target === pokemonDialog) {
        closePokemonDialog();
    }
}

function handleDialogKeyboardNavigation(event) {
    if (!pokemonDialog.open) {
        return;
    }
    if (displayedPokemon !== allPokemon) {
        return;
    }
    switch (event.key) {
        case "ArrowLeft":
            showPreviousPokemon();
            break;
        case "ArrowRight":
            showNextPokemon();
            break;
    }
}

function initSearch() {
    searchButton.addEventListener("click", searchPokemon);
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchPokemon();
        }
    });

    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim() === "") {
            searchMessage.textContent = "";
            renderPokemonCards();
        }
    });
}

async function searchPokemon() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm.length === 0) {
        searchMessage.textContent = "";
        renderPokemonCards(allPokemon);
        loadMoreButton.classList.remove("hidden");
        return;
    }
    if (searchTerm.length < 3) {
        searchMessage.textContent =
            "Please enter at least 3 characters.";
        return;
    }
    searchMessage.textContent = "";
    showLoading();
    try {
    const matches = pokemonList.filter((pokemon) =>
        pokemon.name.includes(searchTerm)
    );
    if (matches.length === 0) {
    renderPokemonCards([]);
    loadMoreButton.classList.add("hidden");
    searchMessage.textContent = "";
    return;
}
    const pokemonDetails = await Promise.all(
        matches.map((pokemon) =>
            fetchPokemonByName(pokemon.name)
        )
    );
    renderPokemonCards(pokemonDetails);
    loadMoreButton.classList.add("hidden");

    } catch (error) {
    console.error(error);
    searchMessage.textContent =
        "Something went wrong. Please try again.";
    } finally {
    hideLoading();
    }
}    

async function loadPokemon() {
    showLoading();
    try {
        const newPokemon = await fetchPokemonList(limit, offset);
        allPokemon.push(...newPokemon);
        renderPokemonCards();
        offset += limit;
        loadMoreButton.classList.remove("hidden");
    } catch (error) {
        console.error(error);
    } finally {
        hideLoading();
    }
}

function renderPokemonCards(pokemonList = allPokemon) {
    displayedPokemon = pokemonList;
    pokemonContainer.innerHTML = "";
    if (pokemonList.length === 0) {
        pokemonContainer.innerHTML = getEmptyStateTemplate();
        return;
    }
    let content = "";
    pokemonList.forEach((pokemon, index) => {
        content += getPokemonCardTemplate(pokemon, index);
    });

    pokemonContainer.innerHTML = content;
}

function openPokemonDialog(index) {
    currentPokemonIndex = index;
    currentDialogPokemon = displayedPokemon[index];
    currentTab = "about";
    renderPokemonDialog();
    pokemonDialog.showModal();
    document.body.style.overflow = "hidden";
}

function renderPokemonDialog() {
    const showNavigation = displayedPokemon === allPokemon;

    pokemonDialog.innerHTML = getPokemonDialogTemplate(
        currentDialogPokemon,
        currentPokemonIndex,
        showNavigation
    );
    switch (currentTab) {
        case "about":
            showAbout();
            break;
        case "stats":
            showStats();
            break;
        case "evolution":
            showEvolution();
            break;
    }
}

function closePokemonDialog() {
    pokemonDialog.close();
    document.body.style.overflow = "";
}

function showLoading() {
    loadMoreButton.classList.add("hidden");
    loading.classList.add("show");
}

function hideLoading() {
    loading.classList.remove("show");
}

function showNextPokemon() {
    if (currentPokemonIndex === allPokemon.length - 1) {
        return;
    }
    currentPokemonIndex++;
    currentDialogPokemon = allPokemon[currentPokemonIndex];
    renderPokemonDialog();
}

function showPreviousPokemon() {
    if (currentPokemonIndex === 0) {
        return;
    }
    currentPokemonIndex--;
    currentDialogPokemon = allPokemon[currentPokemonIndex];
    renderPokemonDialog();
}

function showAbout() {
    currentTab = "about";
    renderAboutTab(currentDialogPokemon);
}

function renderAboutTab(pokemon) {
    document.getElementById("dialog-content").innerHTML = getAboutTemplate(pokemon);
    setActiveTab("about-tab");
}

function showStats() {
    currentTab = "stats";
    renderStatsTab(currentDialogPokemon);
}

function renderStatsTab(pokemon) {
    document.getElementById("dialog-content").innerHTML = getStatsTemplate(pokemon);
    setActiveTab("stats-tab");
}

async function showEvolution() {
    currentTab = "evolution";
    const evolutionList = await loadEvolutionData(currentDialogPokemon);
    renderEvolutionTab(evolutionList);
}

function renderEvolutionTab(evolutionList) {
    document.getElementById("dialog-content").innerHTML = getEvolutionTemplate(evolutionList);
    setActiveTab("evolution-tab");
}

async function loadEvolutionData(pokemon) {
    const species = await fetchPokemonSpecies(pokemon.species.url);
    const evolutionChain = await fetchEvolutionChain(
        species.evolution_chain.url
    );
    const evolutionNames = extractEvolutionChain(evolutionChain.chain);
    const evolutionList = await Promise.all(
        evolutionNames.map(async (name) => {
            const pokemonData = await fetchPokemonByName(name);
            return {
                name: name,
                image:
                    pokemonData.sprites.other["official-artwork"]
                        .front_default,
            };
        })
    );
    return evolutionList;
}

function extractEvolutionChain(chain){
    const evolutionList = [];
    while (chain) {
        evolutionList.push(chain.species.name);
        chain = chain.evolves_to[0];
    }
    return evolutionList;
}

function setActiveTab(activeTabId) {
    const aboutTab = document.getElementById("about-tab");
    const statsTab = document.getElementById("stats-tab");
    const evolutionTab = document.getElementById("evolution-tab");

    aboutTab.classList.remove("active");
    statsTab.classList.remove("active");
    evolutionTab.classList.remove("active");

    document
        .getElementById(activeTabId)
        .classList.add("active");
}