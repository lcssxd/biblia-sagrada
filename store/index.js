import db from '~/assets/json/db.json'

export const state = () => ({
  version: 'ARA',
  theme: 'dark',
  fontSize: 12,
  fontFamily: 'auto',
  book: null,
  chapter: null,
  favoriteVerse: [],
  searchVerse: [],
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
    return state.favoriteVerse;
  },
  getSearchVerse(state) {
    return state.searchVerse;
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
    const fontMin = 12, fontMax = 24;
    let fontSize = parseInt(localStorage.getItem('fontSize'), 10);
  
    if (isNaN(fontSize)) {
      fontSize = fontMin;
    } else if (fontSize < fontMin) {
      fontSize = fontMin;
    } else if (fontSize > fontMax) {
      fontSize = fontMax;
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
  UPDATE_FAVORITE_VERSE(state) {
    const favoriteVerse = JSON.parse(localStorage.getItem('favoriteVerse') || '[]');
    state.favoriteVerse = favoriteVerse;
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
    const fontMin = 12, fontMax = 24;
    const fontSize = Number(payload);

    if (fontSize >= fontMin && fontSize <= fontMax) {
      state.fontSize = fontSize;
      localStorage.setItem('fontSize', String(fontSize));
    }
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
    localStorage.setItem('book', payload);
  },
  SET_CHAPTER(state, payload) {
    state.chapter = payload;
    localStorage.setItem('chapter', payload);
  },
  FAVORITE_VERSE(state, payload) {
    state.favoriteVerse = payload;
    localStorage.setItem('favoriteVerse', JSON.stringify(payload));
  },
  SEARCH_VERSE(state, payload) {
    if (Array.isArray(payload) && payload.length === 0) {
      state.searchVerse = [];
    } else {
      state.searchVerse.push(payload);
    }
    localStorage.setItem('searchVerse', JSON.stringify(state.searchVerse));
  }
}

export const actions = {
  toggleFavoriteVerse({ commit, state }, verseItem) {
    let updatedFavoriteVerse = [...state.favoriteVerse];
  
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
  
    commit('FAVORITE_VERSE', updatedFavoriteVerse);
  }  
}

