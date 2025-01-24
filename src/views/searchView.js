import View from './view.js'

class SearchView extends View {
  _parentEl = document.querySelector('.search');
  getQuery() {
    return this._parentEl.querySelector('.search__field').value;
  }

  addSearchHandler(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();