<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header>
      <h1>{{ title }}</h1>
    </Header>
    <fieldset class="text-color">
      <label for="Search" class="hidden">Procurar</label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <magnifyingGlassIcon class="size-5" />
        </span>
        <input
          type="search"
          name="Search"
          v-model="name"
          class="w-full py-2 pl-10 pr-2 border-b bg-transparent border-gray-200 dark:border-gray-600 old:border-brown-200 outline-none"
          required
          autofocus
          autocomplete="off"
        >
      </div>
    </fieldset>
    <div class="overflow-y-auto h-full">
      <div v-if="nothingSearch || loading" class="flex items-center justify-center h-full text-color">
        <div v-if="nothingSearch" class="flex flex-col items-center space-y-4">
          <magnifyingGlassIcon class="size-16" />
          <p class="select-none">Busque por um texto</p>
        </div>
        <div v-if="loading" class="flex items-center justify-center space-x-2">
          <div v-for="index in 3" :key="index" class="size-4 rounded-full animate-pulse bg-gray-300 dark:bg-gray-700 old:bg-brown-300"></div>
        </div>
      </div>
      <div v-if="foundResults" class="divider-y">
        <div class="flex-result">{{ searchResults.length }} resultados foram encontrados</div>
        <div v-for="(item, index) in searchResults" :key="index" class="flex items-center p-2">
          <button class="text-left select-none outline-none" @click.prevent="goToText(item)">
            <p>"<span v-html="changeTags(item.text)"></span>" {{ getBookAndChapterName(item.book_number, item.chapter, item.verse) }}</p>
          </button>
        </div>
      </div>
      <div v-if="notFoundResults">
        <div class="flex-result">Nenhum texto foi encontrado</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'
import magnifyingGlassIcon from '@/static/heroicons/mini/magnifying-glass.svg?inline'
export default {
  components: { arrowlongleftIcon, magnifyingGlassIcon },
  data() {
    return {
      title: 'Procurar',
      name: '',
      loading: false,
      verses: null,
      books: null,
      searchResults: [],
      searchTimeout: null,
      searchTextSelected: ''
    }
  },
  async mounted() {
    await this.loadVersionFiles()
    this.UPDATE_VERSION()
  },
  watch: {
    name(newVal, oldVal) {
      if (newVal === '') {
        this.resetSearchState();
      } else if (oldVal !== newVal) {
        this.initiateSearchWithDebounce();
      }
    }
  },
  computed: {
    ...mapGetters(['getVersion', 'getSearchVerse']),
    emptyName() {
      return this.name === '' ? true : false
    },
    foundName() {
      return this.name !== '' ? true : false
    },
    nothingSearch() {
      return !this.loading && this.emptyName && this.searchResults && this.searchResults.length === 0 && this.searchTextSelected === ''
    },
    foundResults() {
      return !this.loading && this.searchResults && this.searchResults.length > 0
    },
    notFoundResults() {
      return !this.loading && this.searchResults && this.searchResults.length === 0 && this.searchTextSelected !== ''
    }
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'SET_BOOK', 'SET_CHAPTER', 'SEARCH_VERSE']),
    async loadVersionFiles() {
      const version = this.getVersion;
      const [books, verses] = await Promise.all([
        import(`@/assets/json/books.json`),
        import(`@/assets/json/versions/${version}/verses.json`)
      ]);
      this.books = books.default;
      this.verses = verses.default;
    },
    searchText() {
      if(this.foundName) {
        this.searchResults = this.verses.filter(v =>
          v.text.toLowerCase().includes(this.name.toLowerCase())
        )
        this.loading = false
        this.searchTextSelected = this.name
      }
    },
    getBookAndChapterName(bookId, chapter, verse) {
      if (!this.books || bookId === undefined || chapter === undefined || verse === undefined) {
        return '';
      }

      const foundBook = this.books.find(item => item.book_number === bookId);

      if (!foundBook) {
        return 'Livro não encontrado';
      }

      return `${foundBook.name} ${chapter}:${verse}`;
    },
    goToText(verseItem) {
      const foundBook = this.books.find(item => item.book_number === verseItem.book_number);
      this.cancelSelected()
      this.SET_BOOK(foundBook)
      this.SET_CHAPTER(verseItem.chapter)
      this.SEARCH_VERSE(verseItem)
      this.$router.push('/bible');
    },
    changeTags(text) {
      const regex = new RegExp(`(${this.searchTextSelected})`, 'gi');
      const highlightedText = text.replace(regex, `<span class="selected-verse">$1</span>`);
      const styledText = highlightedText.replace(/<J>(.*?)<\/J>/g, '<span class="j-tag">$1</span>');
      const cleanedText = styledText.replace(/<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>|<font size=-1>|<\/font>|<i>.*?<\/i>/g, '').replace(/\s{2,}/g, ' ');

      return cleanedText;
    },
    cancelSelected() {
      this.SEARCH_VERSE([]);
    },
    resetSearchState() {
      this.searchResults = [];
      this.searchTimeout = null;
      this.searchTextSelected = '';
      this.loading = false;
    },
    initiateSearchWithDebounce() {
      this.loading = true;
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.searchText();
      }, 1000);
    },
  }
}
</script>

<style scoped>
.flex-result {
  @apply flex text-center text-gray-400 dark:text-gray-500 old:text-brown-400 p-2;
}
</style>
