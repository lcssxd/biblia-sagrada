export const state = () => ({
  currentBook: null,
  currentChapter: null,
})

export const mutations = {
  initialize(state) {
    const currentBook = localStorage.getItem('currentBook');
    const currentChapter = localStorage.getItem('currentChapter');

    state.currentBook = currentBook;
    state.currentChapter = currentChapter;

    localStorage.setItem('currentBook', state.currentBook);
    localStorage.setItem('currentChapter', state.currentChapter);
  },
  setCurrentBook(state, payload) {
    state.currentBook = payload;
    localStorage.setItem('currentBook', payload);
  },
  setCurrentChapter(state, payload) {
    state.currentChapter = payload;
    localStorage.setItem('currentChapter', payload);
  }
}
