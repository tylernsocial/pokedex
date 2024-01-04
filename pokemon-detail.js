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
 * this function is designed to extract and retrun the English flavor
 * text froma given pokemon species data/
 */
function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}
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
/**
 * the function will capitalizes the first letter of a given string
 *
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
/**
 * the function sets the background and border colours of certain elements on
 * the webpage based on the pokemons primary type
 *
 * the first line will retrieve the name of the first type of the given pokemon, and
 * since pokemon can have one or two type, so this line assumes that the first type
 * in the array is the primary type
 *
 * next the function will accesses a colour value from the typeColors array using the
 * primary type as the key
 *
 * then it will check if a colour is found for the given type and if it is not found
 * then it logs a warning message to the console and returns from the function which will
 * prevent further execution
 *
 * next the function will select the first element with the class name detail-main and then
 * calls setElementStyles to set the background colour of the first element that was selected
 * to the colour that was obtained from typeColors and the same thing for border colour, as
 * well as set styles for the other elements
 *
 * then it will add custome styles using a style tag where it will convert the hex colour
 * value to an RGBA value with a specific opacity, create a new style tag and adds custom
 * CSS styles to it and append this style tag to the documents
 *
 */
function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];
  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }
  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);
  setElementStyles(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    color
  );
  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );
  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );
  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}
/**
 * the function will create a new HTML element and apply various properties to it,
 * append it to a specified parent element and then return the newly created element
 *
 * the function accepts three parameters, parent: the parent DOM element to which the new
 * element will be appended, tag: a string representing the tag name of the new element
 * to be created and options: an optional object containing properties to be set on
 * the new element it has a default value of an empty object
 *
 * next the function will create a new element of the type specified by the tag parameter
 *
 * Object.keys(options) will get an array of the property names (keys) in the options
 * object, then for each key the corresponding property on the element is set to the value
 * from the options object
 *
 * then the newly created and configured element is appended to the parent element using
 * appendChild, this inserts the element into the DOM as a child of parent, then finally
 * the function returns the newly created element
 */
function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}
/**
 * the function is used for displaying variopus details of a specific pokemon
 * 
 * the first line destructures the pokemon object where it extract its properties
 * 
 * then the pokemons name will be capitalized and then set as the text content of the 
 * documents title tag
 * 
 * the main detail element is then selected and a class based on the pokemons name is added
 * to it, the name of the pokemon is also displayed in an element will class .name-wrap .name
 * 
 * the pokemons ID is formatted to a 3 digit string which are padded with zeros if necessary
 * and displays it, next the function will select the image element and sets its src
 * attribute to the URL of the pokemons image using its ID and the alt attribute is set
 * to the pokemons name 
 * 
 * the function then clears and updates the .power-wrapper element with the pokemons types
 * and creating new elements for each type, and after it also updates elements to display
 * the pokemons weight and height converting them to kilograms and meters. next it also 
 * iterates over the pokemons abilities, creating and appending new elements to display 
 * each ability, then the .stats-wrapper element is cleared and then iterates over the
 * pokemon states where for each stat it creates new elements to display the stat name,
 * its base value and a progess bar representing the stat 
 * 
 * finally the function will call setTypeBackgroundColor which will set the background colour
 * of elements based on the pokemons type
 */
function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);
  document.querySelector("title").textContent = capitalizePokemonName;
  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());
  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;
  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;
  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
  imageElement.alt = name;
  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;
  const abilitiesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });
  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";
  const statNameMapping = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };
  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);
    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });
    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });
    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });
  setTypeBackgroundColor(pokemon);
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
  const MAX_POKEMONS = 493;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);
  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }
  currentPokemonId = id;
  loadPokemon(id);
});