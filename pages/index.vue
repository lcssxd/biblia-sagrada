<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header>
      <h1>{{ title }}</h1>
    </Header>
    <div class="h-full">
      <LoadingPage v-if="loading" />
      <div v-if="!loading && verseOfTheDay" class="p-1">
        <div class="px-4 py-2 rounded bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100 old:bg-brown-200 old:text-brown-700">
          <span class="font-semibold select-none">{{ getBookAndChapterName(verseOfTheDay.book_number, verseOfTheDay.chapter, verseOfTheDay.verse) }}</span>
          <button class="select-none text-left" @click.prevent="goToText(verseOfTheDay)">
            <span v-html="$changeTags(verseOfTheDay.text)"></span>
          </button>
        </div>
      </div>
      <div v-if="!loading && !verseOfTheDay" class="flex items-center justify-center h-full text-color">
        <p class="select-none">Nenhum versículo encontrado</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import LoadingPage from '~/components/Loading.vue';

export default {
  components: { LoadingPage },
  data() {
    return {
      title: 'Versículo do Dia',
      loading: true,
      verses: null,
      verseOfTheDay: null,
      books: null
    }
  },
  async mounted() {
    await this.loadVersionFiles();
    this.UPDATE_VERSION();
    this.getVerseOfTheDay();
  },
  computed: {
    ...mapGetters(['getVersion']),
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'SET_BOOK', 'SET_CHAPTER', 'SEARCH_VERSE']),
    async loadVersionFiles() {
      if (!this.verses || !this.books) {
        const version = this.getVersion;
        const [books, verses] = await Promise.all([
          import(`@/assets/json/books.json`),
          import(`@/assets/json/versions/${version}/verses.json`)
        ]);
        this.books = books.default;
        this.verses = verses.default;
      }
      this.loading = false;
    },
    getIndexSeed() {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      return day + month + year;
    },

    getVerseOfTheDay() {
      const totalVerses = this.verses.length;
      if (totalVerses === 0) {
        this.verseOfTheDay = null;
        return;
      }

      const indexSeed = this.getIndexSeed();
      const verseIndex = indexSeed % totalVerses;

      this.verseOfTheDay = this.verses[verseIndex] ? {
        book_number: this.verses[verseIndex].book_number,
        chapter: this.verses[verseIndex].chapter,
        verse: this.verses[verseIndex].verse,
        text: this.verses[verseIndex].text
      } : null;
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
    }
  }
}
</script>

<style>

</style>
