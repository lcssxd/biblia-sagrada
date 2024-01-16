export const state = () => ({
  version_default: 'ARA',
  thema_default: 'dark',
  version: 'ARA',
  thema: 'dark',
  text_size_default: '',
  text_size: '',
  book: null,
  chapter: null,
})

export const getters = {
  getVersion(state) {
    return state.version;
  },
  getThema(state) {
    return state.thema;
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
  UPDATE_THEMA(state) {
    const thema = localStorage.getItem('thema');
    const validThemas = ['light', 'dark'];

    if (validThemas.includes(thema)) {
      state.thema = thema;
    } else {
      state.thema = state.thema_default;
    }
    localStorage.setItem('thema', state.thema);
  },
  SET_VERSION(state, payload) {
    const validVersions = ['ARA', 'NTLH'];

    if (validVersions.includes(payload)) {
      state.version = payload;
      localStorage.setItem('version', payload);
    }
  },
  SET_THEMA(state, payload) {
    const validThemas = ['light', 'dark'];

    if (validThemas.includes(payload)) {
      if(payload === 'light') {
        document.documentElement.classList.remove('dark')
      } else if (payload === 'dark') {
        document.documentElement.classList.add('dark')
      }
      state.thema = payload;
      localStorage.setItem('thema', payload);
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
