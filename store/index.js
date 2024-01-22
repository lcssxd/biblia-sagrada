export const state = () => ({
  version: 'ARA',
  thema: 'dark',
  font_family: '',
  book: null,
  chapter: null,
  favorite_verse: [],
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
  getFavoriteVerse(state) {
    return state.favorite_verse;
  }
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
  UPDATE_FAVORITE_VERSE(state) {
    const favorite_verse = JSON.parse(localStorage.getItem('favorite_verse') || '[]');
    state.favorite_verse = favorite_verse;
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
  FAVORITE_VERSE(state, payload) {
    state.favorite_verse = payload;
    localStorage.setItem('favorite_verse', JSON.stringify(payload));
  }
}

export const actions = {
  toggleFavoriteVerse({ commit, state }, verseItem) {
    let updatedFavoriteVerse = [...state.favorite_verse]; // Cria uma cópia do estado atual

    const toggleId = (item) => {
      const index = updatedFavoriteVerse.indexOf(item.id);
      if (index === -1) {
        updatedFavoriteVerse.push(item.id); // Adiciona o ID se não estiver na lista
      } else {
        updatedFavoriteVerse.splice(index, 1); // Remove o ID se estiver na lista
      }
    };

    if (Array.isArray(verseItem)) {
      verseItem.forEach(toggleId);
    } else {
      toggleId(verseItem);
    }

    commit('FAVORITE_VERSE', updatedFavoriteVerse); // Chama a mutation com o novo estado
  }
}

