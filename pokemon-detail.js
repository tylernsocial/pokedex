let currentPokemonID = null;
const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    dark: "#EE99AC",
  };
/**
 * this function will apply a specific CSS style to a collection of 
 * DOM elements where it will iterate over each element in the elements collection
 * where it will dynamically set a CSS property on the element by using bracket 
 * notation '[cssProperty]' 
 */
function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
      element.style[cssProperty] = value;
    });
  }
/**
 * the function converts a hex colour code to an RGB colour format, where each 
 * slice extract the red, green and blue components of the hex colour and will return 
 * them in an r,g,b format
 */
function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}
/**
 * this code snippit is executed when the HTML document is fully loaded
 * which then it sets up the intial state by determining which pokemon
 * to display based on the ID int he URL's query string, it checks whether
 * this ID is valid and within an expected range, now if the ID is
 * invalid or out of range, the user will be redirected to a main page,
 * otherwise the application proceeds to load and display the pokemon
 * corresponding to the given ID
 *
 * the event type DOMContentLoaded which is fired when the intial HTML
 * document has been completely loaded and parsed without waiting for
 * stylesheets and images to finish loading
 *
 * pokemonID is extracted from the URL's query parameters which uses
 * URLSearchParams and window.location.search in order to parse the query
 * string of the URL. is specifically retrieves the value associated with
 * the ID parameter which is expected to be the ID of a pokemon
 *
 * this id is then parsed as an integer using parseInt ensuring it has
 * a numerical value where the second argument 10 specifies the base for
 * the numerical conversion which is in base 10 = decimal
 *
 * if the id is outside the valid range of the max amount of pokemons that
 * this pokedex holds it will redirect the user to the main page, index.html,
 *
 * finally it will load the current pokemon and displays its data along with
 * it
 */
document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 151;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);
  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }
  currentPokemonId = id;
  loadPokemon(id);
});
/**
 * this function will load and display details of a specific pokemon
 * based on its ID, it handles fetching data, updating the UI, navigating between 
 * pokemon and managing browser history state all while providing error handling 
 * and ensuring that the data matches the correct intended pokemon ID
 *
 * now two API requests are made simultaneously using Promise.all which allows
 * them to be processed in parallel, the first request will fetch general 
 * information about the pokemon from pokeapi and the second request fetches
 * species specific information, then each request response will be converted
 * to JSON and the results will be destructured into the pokemon and 
 * pokemonSpecies variables
 * 
 * next, the function will select a DOM element with class .pokemon-detail-wrap 
 * and .pokemon-detail.move which is part of the UI for displaying the pokemons
 * abilities, as well as it will clear any exisiting content in abilitiesWrapper
 * 
 * the condition will check if the current pokemon id matches the id passed to 
 * the function, which will ensure that the data being loaded corresponds to the 
 * currently selected or intended pokemon
 * 
 * displayPokemonDetails will get the pokemon passed in and will be responsibile for 
 * populating the UI with details of the pokemon 
 * 
 * the function will then retrieve the English flavor text from pokemonSpecies meaning
 * the short description of the pokemon (fun fact about it) and will update the text
 * content of an element with the class named .body3-fonts.pokemon-description with the 
 * flavor text
 * 
 * then it will select left and right arrow elements and removes any previously 
 * attached navigatePokemon event listners and add new event listeners to these 
 * arrows to navigate between pokemon IDs as long as the current ID is not at the 
 * respective boundaries of 1 and MAX_POKEMONS
 * 
 * next, window.history.pushState({}, "", `./detail.html?id=${id}`); will update the
 * browsers history to reflect the current pokemons detail page URL without reloading
 * the page
 * 
 */
async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilitiesWrapper.innerHTML = "";
    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;
      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);
      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== 151) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }
      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }
    return true;
  } catch (error) {
    console.error("An error occured while fetching Pokemon data:", error);
    return false;
  }
}
/**
 * this function serves as a navigation handler, where its role is to update
 * the application state to focus on a new pokemon and ensure that the details
 * of this pokemon are loaded and displayed to the user 
 */
async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}
