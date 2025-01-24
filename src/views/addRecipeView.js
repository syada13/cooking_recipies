import View from './view.js'

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _sucessMessage = 'Recipe was successfully uploaded'
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btn_open = document.querySelector('.nav__btn--add-recipe');
  _btn_close = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowRecipe();
    this._addhandlerHideRecipe();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowRecipe() {
    this._btn_open.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addhandlerHideRecipe() {
    this._btn_close.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]
      const data = Object.fromEntries(dataArr);
      handler(data);
    })
  }

  _generateMarkup() {

  }

}

export default new AddRecipeView();