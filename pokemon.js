const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = []; //pokemon storage

/**
 * getting all the info from the api on the pokemon up to MAX_POKEMON
 * including their types, name, number, summary, etc.
 * ie: if MAX_POKEMON = 151, all info from Bulbasaur(1) to Mew(151)
 * 
 * fetch to make network request, where the url is the API endpoint
 * such that it requests a list of pokemon
 * 
 * once fetch request is completed it will return a response object,
 * which represents the response of the request and at the first .then it
 * will turn the response into a JSON object
 * 
 * at the next .then it will handle the result from above, such that
 * data is the JSON object obtained from the the most recent .then
 * and data.results contains the actual data of interest which is the 
 * list of pokemon 
 */
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
});

/**
 * synchronous code: is executed in a sequence meaning that all the
 * statements need to wait for the previous one to finish before 
 * executing. 
 * characteristics: 
 *  blocking: 
 *            since each operation blocks the next one from starting 
 *            until it completes, in an envionment like JS in a 
 *            browser can lead to freezing the application meaning 
 *            it becomes unresponsive until the synchronous task
 *            completes.
 *  simplicity and predicatbility: 
 *            flow of execution is predicatable, making it easier
 *            to follow and debug
 * asynchronous code: allows the program to start a potentially time-
 * consuming task and move on to other tasks without waiting for the
 * first task to complete. 
 * characteristics:
 *  non-blocking: 
 *            asynchronous operations are non-blocking which means
 *            that the code execution continues to the next line
 *            without waiting for the asynchronous task to complete
 * note: a promise is an object that represents the eventual completion
 * or failure of an asynchronous operations, this allows the writing of 
 * code that assumes a value that will be available at some point in the 
 * future without stopping the whole program to wait for that value
 * 
 * function designed to fetch data from the PokeApi asynchronously 
 * before redirecting to another page or performing another action
 * 
 * Promise.all is used to handle multiple Promises, where it takes an
 * array of Promises and returns a single Promise that resolves when 
 * all of the input Promises have resolved. await is used to wait for
 * Promise.all to resolve, it will pause the function execution until 
 * both API requests have completed and the responses have been
 * converted to JSON
 * 
 * fetch request are made to two different endpoints of the PokeApi, 
 * one for the specific pokemon and its species through its provided id
 * (ID=1 = bulbasuar)
 *   
 * the first and second .then converts the response of each fetch call 
 * to a JSON object  
 * 
 * then the results are destructured into pokemon and pokemonSpecies
 * variables (Destructuring is a convenient way of extracting multiple 
 * properties from an object or items from an array and assigning them 
 * to variables)
 * 
 * after a successful execution of the fetch calls and data processing
 * the function will return true in order to indicate that the data was
 * successful
 */
async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to fetch Pokemon data before redirect");
  }
}

/**
 * function designed to dynamically display a list of pokemon on the
 * webpage that takes an array of pokemon objects
 * 
 * setting listWrapper's innerHTML to an empty string which clears
 * all existing content in listWrapper, which is done to remove any
 * previously displayed pokemon before showing new ones
 * 
 * each pokemon object has a url property, which will be split into 
 * an array of strings using / as the delimiter the pokemon's ID is 
 * extracted fromt he sixth element of the array hence [6]
 * 
 * then a new div element is created for each pokemon, where the class
 * list-item is assigned to this div for styling
 * 
 * innerHTML of the div is set to a template literal containing HTML 
 * structure for displaying the pokemon, which includes, a div for 
 * the pokemons ID, an image element to display the pokemons sprite/img
 * which is fetched from an external URL using the pokemon its ID and 
 * a div for the pokemons name
 * 
 * an event listener is added to listItem for the click event, such that
 * when clicked an asynchronous function is exectued, which the function
 * "fetchingPokemonDataBeforeRedirect" is called with pokemonID, which 
 * fetches detailed data about the pokemon and is awaited until it 
 * completes, if the function returns true the browswer will redirect 
 * the user to a detail page for the clicked pokemon passing the pokemonID
 * in the query string
 * 
 * lastly, the constructed listItem is appended to the listWrapper element
 * which adds the new item to the DOM making it visible on the webpage 
 */
function displayPokemons(pokemon) {
  listWrapper.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
        <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/home/${pokemonID}.png" alt="${pokemon.name}" />       
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">#${pokemon.name}</p>
        </div>
    `;

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    listWrapper.appendChild(listItem);
  });
}



/**
 * funciton is designed to handle a search for a specific pokemon
 * via their name or number ID (ie: one can search b and all pokemon
 * that start with b will appear or one can search 1 and all pokemon
 * that have a 1 at the beginning of their number ID will appear)
 * 
 * from the input in the search bar will be placed into searchTerm 
 * and this value will be converted to lowercase to ensure that this 
 * search operation is case-insensitive
 * 
 * filteredPokemons variable delcared in order to store an array of 
 * pokemon that matches the search criteria
 * 
 * now if numberFilter is checked this means that the user wants to 
 * search my pokemon number ID (ie, 1 = bulbasuar) such that the function
 * filters pokemon by their ID, through the help of the built in filter
 * method which is used to create a new array of pokemon whose IDs 
 * start with the searchTerm, the ID is extracted from the pokemons url
 * property and if nameFilter is checked instead of number, then the 
 * filter method will create a new array that checks if the pokemons 
 * name starts with the searchTerm, however if none of the filters are
 * checked then the default is to set filteredPokemons to the entire list
 * of pokemons
 * 
 * then the function will display the filtered pokemons with the use of
 * the displayPokemons function that takes in the filtered pokemons
 * 
 * lastly when no pokemon match the search criteria the function will
 * change the style of notFoundMessage to block so that it displays a
 * message and if there are match pokemon the notFoundMessage will 
 * be hidden
 */
function handleSearch(){
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;
  if(numberFilter.checked){
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => 
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }
  displayPokemons(filteredPokemons);
  if(filteredPokemons.length === 0){
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}
/*
* makes the web page responsive to user input in the search field, 
* triggering the search and filtering logic in real-time as the 
* user types.
*/
searchInput.addEventListener("keyup", handleSearch);

/**
 * to clear the search field and the display pokemon back to default
 */
const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);
function clearSearch(){
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}