const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modalContainer = document.getElementById('pokemonDetailModal')

const maxRecords = 151
const limit = 10
let offset = 0

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemonList.innerHTML += pokemons.map((pokemon) => `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>

                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>

                </li>
        `).join('')
    })
}

loadPokemonItems(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtdRecordNextPage = offset + limit

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItems(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItems(offset, limit)
    }
})

function showPokemonDetails(pokemon) {
    const modalContent = document.querySelector('.modal-content')
    const maxStat = 180
    const abilitiesHtml = pokemon.abilities.map(ability => `<span>${ability}</span>`).join('');
    const statsHtml = Object.entries(pokemon.stats).map(([name, value]) => `
        <li><span>${name.replace('-', ' ')}</span> 
        <div class="stat-bar">
                <div class="stat-fill ${pokemon.type}" style="width: ${(value / maxStat) * 100}%;"></div>
            </div>
            <span>${value}</span>
        </li>
    `).join('');

    const pokemonDetailHtml = `
        <div class="modal-header ${pokemon.type}">
            <button class="close-button">&times;</button>

            <div class="header-main-info">
                <h2 class="name">${pokemon.name}</h2>
                <span class="number">#${String(pokemon.number).padStart(3, '0')}</span>
            </div>

            <div class="types">
                ${pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join('')}
            </div>

            <img class="pokemon-image" src="${pokemon.photo}" alt="${pokemon.name}">
        </div>

        <div class="modal-body">
            <div class="details-content">
                <div class="about-section">
                    <span>Height:</span> <strong>${pokemon.height} m</strong>
                    <span>Weight:</span> <strong>${pokemon.weight} kg</strong>
                    <span>Abilities:</span> <strong class="abilities">${abilitiesHtml}</strong>
                </div>

                <h3 class="stats-title">Base Stats</h3>
                <ul class="stats-list">${statsHtml}</ul>
            </div>
        </div> 
        `

    modalContent.innerHTML = pokemonDetailHtml

    modalContent.querySelector('.close-button').addEventListener('click', () => {
        modalContainer.style.display = 'none';
    });
}

pokemonList.addEventListener('click', (event) => {
    const clickedLi = event.target.closest('.pokemon');
    if (!clickedLi) return;
    const pokemonId = clickedLi.dataset.id;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    fetch(url)
        .then(response => response.json())
        .then(convertPokeApiDetailToPokemon)
        .then(pokemonDetails => {
            showPokemonDetails(pokemonDetails);
            modalContainer.style.display = 'flex';
        });
});

modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        modalContainer.style.display = 'none';
    }
});