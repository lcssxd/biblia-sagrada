export const state = () => ({
  version: 'ARA',
  thema: 'dark',
  font_family: '',
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
  getFontFamily(state) {
    return state.font_family;
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
      state.version = validVersions[0];
    }
    localStorage.setItem('version', state.version);
  },
  UPDATE_THEMA(state) {
    const thema = localStorage.getItem('thema');
    const validThemas = ['light', 'dark'];

    if (validThemas.includes(thema)) {
      state.thema = thema;
    } else {
      state.thema = validThemas[0];
    }
    localStorage.setItem('thema', state.thema);
  },
  UPDATE_FONT_FAMILY(state) {
    const fontFamily = localStorage.getItem('font_family');
    const validFontsFamily = ['', 'font-serif', 'font-mono'];

    if (validFontsFamily.includes(fontFamily)) {
      state.font_family = fontFamily;
    } else {
      state.font_family = validFontsFamily[0];
    }
    localStorage.setItem('font_family', state.font_family);
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
  SET_FONT_FAMILY(state, payload) {
    const validFontsFamily = ['', 'font-serif', 'font-mono'];

    if (validFontsFamily.includes(payload)) {
      state.font_family = payload;
      localStorage.setItem('font_family', payload);
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
