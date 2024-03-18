export const state = () => ({
  version: 'ARA',
  thema: 'dark',
  font_size: '',
  font_family: '',
  book: null,
  chapter: null,
  favorite_verse: [],
  search_verse: [],
})

export const getters = {
  getVersion(state) {
    return state.version;
  },
  getThema(state) {
    return state.thema;
  },
  getFontSize(state) {
    return state.font_size;
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
  },
  getSearchVerse(state) {
    return state.search_verse;
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
    const validVersions = ['ACF', 'ARA', 'NAA', 'NTLH', 'NVI'];

    if (validVersions.includes(version)) {
      state.version = version;
    } else {
      state.version = validVersions[0];
    }
    localStorage.setItem('version', state.version);
  },
  UPDATE_THEMA(state) {
    const thema = localStorage.getItem('thema');
    const validThemas = ['light', 'dark', 'old'];

    if (validThemas.includes(thema)) {
      state.thema = thema;
    } else {
      state.thema = validThemas[0];
    }
    localStorage.setItem('thema', state.thema);
  },
  UPDATE_FONT_SIZE(state) {
    const fontSize = localStorage.getItem('font_size');
    const validFontsSize = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];

    if (validFontsSize.includes(fontSize)) {
      state.font_size = fontSize;
    } else {
      state.font_size = validFontsSize[0];
    }
    localStorage.setItem('font_size', state.font_size);
  },
  UPDATE_FONT_FAMILY(state) {
    const fontFamily = localStorage.getItem('font_family');
    const validFontsFamily = ['font-sans', 'font-serif', 'font-mono'];

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
    const validVersions = ['ACF', 'ARA', 'NAA', 'NTLH', 'NVI'];

    if (validVersions.includes(payload)) {
      state.version = payload;
      localStorage.setItem('version', payload);
    }
  },
  SET_THEMA(state, payload) {
    const validThemas = ['light', 'dark', 'old'];
    const currentThema = document.documentElement.classList[0];

    if (validThemas.includes(payload)) {
      if(payload === 'light') {
        document.documentElement.classList.remove(currentThema)
      } else {
        document.documentElement.classList.remove(currentThema)
        document.documentElement.classList.add(`${payload}`)
      }
      state.thema = payload;
      localStorage.setItem('thema', payload);
    }
  },
  SET_FONT_SIZE(state, payload) {
    const validFontsSize = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];

    if (validFontsSize.includes(payload)) {
      state.font_size = payload;
      localStorage.setItem('font_size', payload);
    }
  },
  SET_FONT_FAMILY(state, payload) {
    const validFontsFamily = ['font-sans', 'font-serif', 'font-mono'];

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
  },
  SEARCH_VERSE(state, payload) {
    if (Array.isArray(payload) && payload.length === 0) {
      state.search_verse = [];
    } else {
      state.search_verse.push(payload);
    }
    localStorage.setItem('search_verse', JSON.stringify(state.search_verse));
  }
}

export const actions = {
  toggleFavoriteVerse({ commit, state }, verseItem) {
    let updatedFavoriteVerse = [...state.favorite_verse];
  
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

