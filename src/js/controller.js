
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js'
import recipeView from '../views/recipeView.js';
import searchView from '../views/searchView.js';
import recipeView from '../views/recipeView.js';
import resultView from '../views/resultView.js';
import paginationView from '../views/paginationView.js';
import bookmarkView from '../views/bookmarkView.js';
import addRecipeView from '../views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}
const recipeContainer = document.querySelector('.recipe');

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result page
    resultView.update(model.getResultsPerPage());
    bookmarkView.update(model.state.bookmarks);

    // Loading the recipe
    await model.loadRecipe(id);

    // Rendering the recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // Render spinner
    resultView.renderSpinner();

    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load search result
    await model.searchResult(query);

    // Render results
    resultView.render(model.getResultsPerPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err);

  }
}

const controlPagination = function (goToPage) {

  // Render NEW results
  resultView.render(model.getResultsPerPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
}


const controlRecipe = function (newServings) {
  // Update the recipe in the state
  model.updateServing(newServings);

  // Update the recipe view 
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function () {
  // Bookmark recipe
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update bookmarked recipe
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderSuccess();

    // Render bookmarks
    bookmarkView.render(model.state.bookmarks);

    // Close the opened form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)


    console.log(model.state.recipe);
  } catch (err) {
    addRecipeView.renderError(err);
  }
}

const init = function () {
  bookmarkView.addRenderHandler(controlBookmarks);
  recipeView.addEventHandler(showRecipe);
  recipeView.addHandlerUpdateServings(controlRecipe);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResult);
  paginationView.addButtonClickHandler(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();


