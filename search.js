const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");
const sort_wrapper = document.querySelector(".sort-wrapper");

inputElement.addEventListener("input", () => {
  handleInputChange(inputElement);
});
search_icon.addEventListener("click", handleSearchCloseOnClick);
sort_wrapper.addEventListener("click", handleSortIconOnClick);

/**
 * this function will handle changes in the search input field, it 
 * retrieves the current value of inputElement, then if the value
 * is not empty, it will add a class to an element with the ID
 * search-close-icon, however if the input is empty, it removes that class
 */
function handleInputChange(inputElement) {
  const inputValue = inputElement.value;

  if (inputValue !== "") {
    document
      .querySelector("#search-close-icon")
      .classList.add("search-close-icon-visible");
  } else {
    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
  }
}
/**
 * this function clears the value in the search input field when invoked
 * which effectively closing/resetting the search, it will also hide
 * the search close icon by removing its visibility class
 */
function handleSearchCloseOnClick() {
  document.querySelector("#search-input").value = "";
  document
    .querySelector("#search-close-icon")
    .classList.remove("search-close-icon-visible");
}
/**
 * the function toggles the visibility or the state or the sort/filter options 
 * in the UI, it uses the classList.toggle method to add or remove a class on 
 * two elements
 */
function handleSortIconOnClick() {
  document
    .querySelector(".filter-wrapper")
    .classList.toggle("filter-wrapper-open");
  document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}