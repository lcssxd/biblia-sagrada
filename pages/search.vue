<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header class="flex items-center space-x-2">
      <NuxtLink to="/bible" class="flex items-center cursor-pointer outline-none">
        <arrowlongleftIcon class="w-5 h-5" />
      </NuxtLink>
      <span>{{ title }}</span>
    </Header>
    <fieldset class="flex flex-col w-full space-y-1 text-gray-800 dark:text-gray-50">
      <label for="Search" class="hidden">Procurar</label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <button type="button" title="search" class="p-1 outline-none" @click.prevent="searchText">
            <magnifyingGlassIcon class="w-4 h-4" />
          </button>
        </span>
        <input
          type="search"
          name="Search"
          placeholder="Procurar..."
          v-model="name"
          class="w-full py-2 pl-10 pr-2 text-sm border dark:bg-transparent border-gray-200 dark:border-gray-700 outline-none"
          required
          autocomplete="off"
          @keyup.enter="searchText"
        >
      </div>
    </fieldset>
    <div class="overflow-y-auto h-full">
      <div v-if="!loading && searchResults === null" class="flex items-center justify-center h-full text-gray-800 dark:text-gray-50">
        <div class="flex flex-col items-center space-y-4">
          <magnifyingGlassIcon class="w-16 h-16" />
          <p class="text-lg select-none">Busque por um texto</p>
        </div>
      </div>
      <div v-if="loading && searchResults && searchResults.length === 0" class="flex items-center justify-center space-x-2">
        <div class="w-4 h-4 rounded-full animate-pulse bg-gray-100 dark:bg-gray-700"></div>
        <div class="w-4 h-4 rounded-full animate-pulse bg-gray-100 dark:bg-gray-700"></div>
        <div class="w-4 h-4 rounded-full animate-pulse bg-gray-100 dark:bg-gray-700"></div>
      </div>
      <div v-if="!loading && searchResults && searchResults.length > 0" class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
        <div class="flex text-center text-gray-400 dark:text-gray-500 p-2">{{ searchResults.length }} resultados foram encontrados</div>
        <div v-for="(item, index) in searchResults" :key="index" class="flex items-center p-2">
          <button class="text-left select-none outline-none" @click.prevent="goToText(item)">
            <p>"<span v-html="changeTags(item.text)"></span>" {{ getBookAndChapterName(item.book_number, item.chapter, item.verse) }}</p>
          </button>
        </div>
      </div>
      <div v-if="!loading && searchResults && searchResults.length === 0">
        <div class="flex text-center text-gray-400 dark:text-gray-500 p-2">Nenhum texto foi encontrado</div>
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
      title: 'Procurar na bíblia',
      name: '',
      loading: false,
      verses: null,
      books: null,
      searchResults: null,
      searchTimeout: null,
    }
  },
  async mounted() {
    await this.loadVersionFiles()
    this.UPDATE_VERSION()
  },
  watch: {
    name(val) {
      if(val === '') {
        this.loading = false
        this.searchResults = null
      } else {
        if(this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.searchText()
        }, 1000)
      }
    }
  },
  computed: {
    ...mapGetters(['getVersion']),
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'SET_BOOK', 'SET_CHAPTER', 'SEARCH_VERSE']),
    async loadVersionFiles() {
      const version = this.getVersion;
      const [books, verses] = await Promise.all([
        import(`@/assets/versions/books.json`),
        import(`@/assets/versions/${version}/verses.json`)
      ]);
      this.books = books.default;
      this.verses = verses.default;
    },
    searchText() {
      if (!this.name) return

      this.loading = true
      this.searchResults = this.verses.filter(v => 
        v.text.toLowerCase().includes(this.name.toLowerCase())
      )
      this.loading = false
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
      this.SET_BOOK(foundBook)
      this.SET_CHAPTER(verseItem.chapter)
      this.SEARCH_VERSE(verseItem)
      this.$router.push('/bible');
    },
    changeTags(text) {
      const styledText = text.replace(/<J>(.*?)<\/J>/g, '<span class="j-tag">$1</span>');
      const cleanedText = styledText.replace(/<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>/g, '');
      return cleanedText;
    },
  }
}
</script>

<style>

</style>