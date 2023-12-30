const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = []; //pokemon storage

/*
* getting all the info from the api on the pokemon up to MAX_POKEMON
* including their types, name, number, summary, etc. 
* ie: if MAX_POKEMON = 151, all info from Bulbasaur(1) to Mew(151)
*/
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
});
/**
 * fetch to make network request, where the url is the API endpoint
 * such that it requests a list of pokemon
 * 
 * once fetch request is completed it will return a response object,
 * which represents the response of the request and at the first .then it
 * will turn the response into a JSON object
 * 
 * at the next .then it will handle the result from above, such that
 * data is the JSON object obtained from the the most recent .then
 * and data.results contains the actualy data of interest which is the 
 * list of pokemon 
 */
