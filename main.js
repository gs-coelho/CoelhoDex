import { showList, showDetail } from "./navigation.js";
import { listItemTemplate, typeTemplate } from "./templates.js";
import { capitalize } from "./capitalize.js";
import { friendlyFetch } from "./data.js";

// endereço da API: usado para fazer as requisições
const api = "https://pokeapi.co/api/v2/";

// pega todos os elementos HTML que serão necessários
const listEl = document.querySelector("#list");
const detailEl = document.querySelector("#detail-section");
const backEl = document.querySelector(".back-to-list");
const avatarImgEl = document.querySelector("#avatar-img");
const detailAvatarImgEl = detailEl.querySelector(".item-avatar-img");
const detailNumberEl = detailEl.querySelector(".number");
const detailNameEl = detailEl.querySelector(".name");
const detailTitleEl = detailEl.querySelector("#detail-title");
const detailWeightEl = detailEl.querySelector("#detail-weight");
const detailHeightEl = detailEl.querySelector("#detail-height");
const detailTypesEl = detailEl.querySelector("#detail-types");

// lista com todos os pokemons
let pokemons = [];

async function init() {
  // EXERCÍCIO 1
  const pagina = await friendlyFetch(`${api}pokemon?limit=151`);
  pokemons = pagina.results;

  pokemons.forEach(addPokemonNaPagina);
  pokemons.forEach(buscaPokemon);

  //EXERCÍCIO 2
  const itensLista = document.querySelectorAll(`li.list-item`);
  itensLista.forEach((item) => {
    item.addEventListener("click", (evt) => {
      const pokemonClicadoEl = evt.target.offsetParent;
      const idPoke = pokemonClicadoEl.dataset.id;
      const pokemonSelecionadoEl = document.querySelector(
        `li.list-item.selected`
      );

      if (pokemonSelecionadoEl) {
        pokemonSelecionadoEl.classList.remove("selected");
      }

      pokemonClicadoEl.classList.add("selected");
      showDetail();

      //Devido a problemas com a função friendlyfetch, a função fetch foi
      //utilizada aqui ao invés disso.
      fetch(`${api}pokemon/${idPoke}/`)
        .then((response) => response.json())
        .then((detalhesPoke) => {
          avatarImgEl.src = detalhesPoke.sprites.front_default;
          detailAvatarImgEl.src = detalhesPoke.sprites.front_default;
          detailNumberEl.innerHTML = String(detalhesPoke.id).padStart(3, "0");
          detailNameEl.innerHTML = capitalize(detalhesPoke.name);
          detailTypesEl.innerHTML = "";
          detailHeightEl.innerHTML = detalhesPoke.height;
          detailWeightEl.innerHTML = detalhesPoke.weight;
          detalhesPoke.types.forEach((itemTipo) => {
            detailTypesEl.innerHTML += typeTemplate(itemTipo.type.name);
          });

          fetch(detalhesPoke.species.url)
            .then((response) => response.json())
            .then((detalhesEspecie) => {
              const arrayFTE = detalhesEspecie.flavor_text_entries;
              const fte = arrayFTE.find(
                (entry) => entry.language.name === "en"
              );
              if (fte) {
                detailTitleEl.innerHTML = fte.flavor_text;
              }
            });
        });
    });
  });

  backEl.addEventListener("click", showList);
}

async function buscaPokemon(pokemon, indice) {
  const id = indice + 1;

  pokemon.futurosDetalhes = await friendlyFetch(`${api}pokemon/${id}/`);

  const linkImg = pokemon.futurosDetalhes.sprites.front_default;
  document.querySelector(`li[data-id="${id}"] .item-avatar-img`).src = linkImg;
}

function addPokemonNaPagina(pokemon, indice) {
  const id = indice + 1;
  pokemon.id = id;

  let dadosPokemon = {
    number: id,
    imageUrl: "imgs/placeholder.png",
    name: capitalize(pokemon.name),
  };

  listEl.innerHTML += listItemTemplate(dadosPokemon);
}

listEl.innerHTML = "";
init();
