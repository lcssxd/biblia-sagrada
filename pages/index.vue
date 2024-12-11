<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header>
      <h1>{{ title }}</h1>
    </Header>
    <div class="h-full">
      <LoadingPage v-if="loading" />
      <div v-else class="flex items-center justify-center h-full">
        <template v-if="verseOfTheDay">
          <div class="flex flex-col justify-center px-6 space-y-4 size-full text-gray-700dark:text-gray-100 old:text-brown-700">
            <span class="font-semibold select-none text-3xl">{{ getBookAndChapterName(verseOfTheDay.book_number, verseOfTheDay.chapter, verseOfTheDay.verse) }} {{ getVersion }}</span>
            <button class="select-none text-left text-6xl" @click.prevent="goToText(verseOfTheDay)">
              <span class="leading-8 tracking-wide" v-html="$changeTags(verseOfTheDay.text)" />
            </button>
          </div>
        </template>
        <template v-if="!verseOfTheDay">
          <p class="select-none text-color">Nenhum versículo encontrado</p>
        </template>
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
    getDayOfYear() {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 0);
      const diff = today - startOfYear;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      return dayOfYear;
    },
    getVerseOfTheDay() {
      const totalVerses = this.verses.length;
      const totalDaysInYear = 365;
      const dayOfYear = this.getDayOfYear();

      if (totalVerses === 0) {
        this.verseOfTheDay = null;
        return;
      }

      const verseIndex = Math.floor((dayOfYear / totalDaysInYear) * totalVerses);

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
