import db from '~/assets/json/db.json'

export const state = () => ({
  version: 'ARA',
  theme: 'dark',
  fontSize: 18,
  fontSizeMin: 12,
  fontSizeMax: 30,
  fontFamily: 'auto',
  book: null,
  chapter: null,
  favoriteVerses: [],
  searchVerse: [],
  installAppButton: true
})

export const getters = {
  getVersion(state) {
    return state.version;
  },
  getTheme(state) {
    return state.theme;
  },
  getFontSize(state) {
    return state.fontSize;
  },
  getFontFamily(state) {
    return state.fontFamily;
  },
  getBook(state) {
    return state.book;
  },
  getChapter(state) {
    return state.chapter;
  },
  getFavoriteVerse(state) {
    return state.favoriteVerses;
  },
  getSearchVerse(state) {
    return state.searchVerse;
  }
}

export const mutations = {
  UPDATE_VERSION(state) {
    const version = localStorage.getItem('version');
    const validVersions = db.versions.map(version => version.abbrev);

    if (validVersions.includes(version)) {
      state.version = version;
    } else {
      state.version = validVersions[0];
    }
    localStorage.setItem('version', state.version);
  },
  UPDATE_THEME(state) {
    const theme = localStorage.getItem('theme');
    const validThemes = db.themes.map(theme => theme.id);

    if (validThemes.includes(theme)) {
      state.theme = theme;
    } else {
      state.theme = validThemes[0];
    }
    localStorage.setItem('theme', state.theme);
  },
  UPDATE_FONT_SIZE(state) {
    let fontSize = parseInt(localStorage.getItem('fontSize'), 10);

    if (isNaN(fontSize)) {
      fontSize = state.fontSizeMin;
    } else if (fontSize < state.fontSizeMin) {
      fontSize = state.fontSizeMin;
    } else if (fontSize > state.fontSizeMax) {
      fontSize = state.fontSizeMax;
    }

    state.fontSize = fontSize;
    localStorage.setItem('fontSize', String(state.fontSize));
  },
  UPDATE_FONT_FAMILY(state) {
    const fontFamily = localStorage.getItem('fontFamily');
    const validFontsFamily = db.fontsFamily.map(fontFamily => fontFamily.id);

    if (validFontsFamily.includes(fontFamily)) {
      state.fontFamily = fontFamily;
    } else {
      state.fontFamily = validFontsFamily[0];
    }
    localStorage.setItem('fontFamily', state.fontFamily);
  },
  UPDATE_BOOK(state) {
    const book = JSON.parse(localStorage.getItem('book'));
    if (book) {
      state.book = book;
    }
  },
  UPDATE_CHAPTER(state) {
    const chapter = localStorage.getItem('chapter');
    if (chapter) {
      state.chapter = Number(chapter);
    }
  },
  UPDATE_FAVORITE_VERSES(state) {
    const favoriteVerses = JSON.parse(localStorage.getItem('favoriteVerses') || '[]');
    state.favoriteVerses = favoriteVerses;
  },
  SET_VERSION(state, payload) {
    const validVersions = db.versions.map(version => version.abbrev);

    if (validVersions.includes(payload)) {
      state.version = payload;
      localStorage.setItem('version', payload);
    }
  },
  SET_THEME(state, payload) {
    const validThemes = db.themes.map(theme => theme.id);

    if (!validThemes.includes(payload)) return;

    const currentThemeClass = document.documentElement.classList[0];

    if (currentThemeClass !== payload) {

      if (currentThemeClass && currentThemeClass !== 'light') {
        document.documentElement.classList.remove(currentThemeClass);
      }

      if (payload !== 'light') {
        document.documentElement.classList.add(payload);
      }

      state.theme = payload;
      localStorage.setItem('theme', payload);
    }
  },
  SET_FONT_SIZE(state, payload) {
    let fontSize = Number(payload);

    if (isNaN(fontSize)) {
      fontSize = state.fontSizeMin;
    } else if (fontSize < state.fontSizeMin) {
      fontSize = state.fontSizeMin;
    } else if (fontSize > state.fontSizeMax) {
      fontSize = state.fontSizeMax;
    }

    state.fontSize = fontSize;
    localStorage.setItem('fontSize', String(fontSize));
  },
  SET_FONT_FAMILY(state, payload) {
    const validFontsFamily = db.fontsFamily.map(fontFamily => fontFamily.id);

    if (validFontsFamily.includes(payload)) {
      state.fontFamily = payload;
      localStorage.setItem('fontFamily', payload);
    }
  },
  SET_BOOK(state, payload) {
    state.book = payload;
    localStorage.setItem('book', JSON.stringify(payload));
  },
  SET_CHAPTER(state, payload) {
    state.chapter = payload;
    localStorage.setItem('chapter', String(payload));
  },
  FAVORITE_VERSES(state, payload) {
    state.favoriteVerses = payload;
    localStorage.setItem('favoriteVerses', JSON.stringify(payload));
  },
  SEARCH_VERSE(state, payload) {
    if (Array.isArray(payload) && payload.length === 0) {
      state.searchVerse = [];
    } else {
      state.searchVerse.push(payload);
    }
    localStorage.setItem('searchVerse', JSON.stringify(state.searchVerse));
  },
  SET_INSTALL_BUTTON(state, payload) {
    state.installAppButton = payload;
  }
}

export const actions = {
  toggleFavoriteVerse({ commit, state }, verseItem) {
    let updatedFavoriteVerse = [...state.favoriteVerses];

    const toggleItem = (item) => {
      const index = updatedFavoriteVerse.findIndex(favorite =>
        favorite?.book_number === item?.book_number &&
        favorite?.chapter === item?.chapter &&
        favorite?.verse === item?.verse
      );
      if (index === -1) {
        updatedFavoriteVerse.push({
          book_number: item.book_number,
          chapter: item.chapter,
          verse: item.verse
        });
      } else {
        updatedFavoriteVerse.splice(index, 1);
      }
    };

    if (Array.isArray(verseItem)) {
      verseItem.forEach(toggleItem);
    } else {
      toggleItem(verseItem);
    }

    commit('FAVORITE_VERSES', updatedFavoriteVerse);
  }
}

