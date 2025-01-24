import { API_URL, RESULT_PER_PAGE, KEY } from './config.js'
import { getJSON, sendJSON } from './helpers.js'

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULT_PER_PAGE,
    page: 1
  },
  bookmarks: [],
}

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key })
  };
}

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true
    else
      state.recipe.bookmarked = false
  } catch (err) {
    console.error(`${err}`)
    throw err;
  }
}

export const searchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url
      }
    })
  } catch (err) {
    console.error(err);
  }
}

export const getResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export const updateServing = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQuantity = oldQuantity * new servings / old servings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  // Mark recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}


export const uploadRecipe = async function (newRecipe) {
  try {
    // Use Object.entries(in this case newRecipe) when you want to convert an object to array.
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] != '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        const [quantity, unit, description] = ingArr;
        if (ingArr.length != 3) {
          throw new Error('Wrong ingredient format!. Please use the correct format: [Quantity,Unit,Description]');
        }
        return { quantity: quantity ? +quantity : null, unit, description }
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}


const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};
init();

// Use in DEVELOPMENT only , NOT in production
const clearBookmars = function () {
  localStorage.clear('bookmarks');
}

// clearBookmars();

