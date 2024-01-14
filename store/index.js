export const state = () => ({
  version_default: 'ARA',
  version: 'ARA',
  text_size_default: '',
  text_size: '',
  book: null,
  chapter: null,
})

export const getters = {
  getVersion(state) {
    return state.version;
  },
  getBook(state) {
    return state.book;
  },
  getChapter(state) {
    return state.chapter;
  },
}

export const mutations = {
  UPDATE(state) {
    const book = localStorage.getItem('book');
    const chapter = localStorage.getItem('chapter');

    state.book = book;
    state.chapter = chapter;
  },
  UPDATE_VERSION(state) {
    const version = localStorage.getItem('version');
    const validVersions = ['ARA', 'NTLH'];

    if (validVersions.includes(version)) {
      state.version = version;
    } else {
      state.version = state.version_default;
    }
    localStorage.setItem('version', state.version);
  },
  SET_VERSION(state, payload) {
    const validVersions = ['ARA', 'NTLH'];

    if (validVersions.includes(payload)) {
      state.version = payload;
      localStorage.setItem('version', payload);
    }
  },
  SET_BOOK(state, payload) {
    state.book = payload;
    localStorage.setItem('book', payload);
  },
  SET_CHAPTER(state, payload) {
    state.chapter = payload;
    localStorage.setItem('chapter', payload);
  },
}
