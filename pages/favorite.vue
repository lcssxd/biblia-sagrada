<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header>
      <h1>{{ title }}</h1>
    </Header>
    <div class="flex flex-col overflow-y-auto h-full">
      <LoadingPage v-if="loading" />
      <div v-if="!loading && filteredVerses && filteredVerses.length > 0" class="divider-y">
        <div v-for="(item, index) in filteredVerses" :key="index" class="p-2">
          <div class="flex items-center justify-between">
            <span class="font-semibold select-none">{{ getBookAndChapterName(item.book_number, item.chapter, item.verse) }}</span>
            <div class="flex items-center space-x-2">
              <button class="cursor-pointer outline-none" @click.prevent="copyVerse(item)">
                <copyIcon class="size-5" />
              </button>
              <button class="cursor-pointer outline-none" @click.prevent="toggleFavoriteVerse(item)">
                <bookmarkSlashIcon class="size-5" />
              </button>
            </div>
          </div>
          <button class="select-none text-left" @click.prevent="goToText(item)"><span v-html="$changeTags(item.text)"></span></button>
        </div>
      </div>
      <div v-if="!loading && filteredVerses && filteredVerses.length === 0" class="flex items-center justify-center h-full text-color">
        <div class="flex flex-col items-center space-y-4">
          <bookmarkIcon class="size-16" />
          <p class="select-none">Nenhum versículo salvo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'
import copyIcon from '@/static/svgrepo/copy.svg?inline';
import bookmarkIcon from '@/static/heroicons/mini/bookmark.svg?inline';
import bookmarkSlashIcon from '@/static/heroicons/mini/bookmark-slash.svg?inline';
import LoadingPage from '~/components/Loading.vue'

export default {
  components: { arrowlongleftIcon, copyIcon, bookmarkIcon, bookmarkSlashIcon, LoadingPage },
  data() {
    return {
      title: 'Favoritos',
      loading: true,
      verses: null,
      books: null,
    }
  },
  async mounted() {
    await this.loadVersionFiles();
    this.UPDATE_VERSION();
    this.UPDATE_FAVORITE_VERSES();
  },
  computed: {
    ...mapGetters(['getVersion', 'getFavoriteVerse']),
    filteredVerses() {
      if (!this.verses || !this.getFavoriteVerse) {
        return [];
      }

      return this.verses.filter(verseItem =>
        this.getFavoriteVerse.some(favorite =>
          favorite.book_number === verseItem.book_number &&
          favorite.chapter === verseItem.chapter &&
          favorite.verse === verseItem.verse
        )
      )
    }
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'UPDATE_FAVORITE_VERSES', 'SET_BOOK', 'SET_CHAPTER', 'SEARCH_VERSE']),
    ...mapActions(['toggleFavoriteVerse']),
    async loadVersionFiles() {
      const version = this.getVersion;
      const [books, verses] = await Promise.all([
        import(`@/assets/json/books.json`),
        import(`@/assets/json/versions/${version}/verses.json`)
      ]);
      this.books = books.default;
      this.verses = verses.default;
      this.loading = false;
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
    copyVerse(verseItem) {
      let verseToCopy = `"${this.$removeTags(verseItem.text)}" (${this.getBookAndChapterName(verseItem.book_number, verseItem.chapter, verseItem.verse)})`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(verseToCopy)
          .then(() => {
            this.$toast.success("Copiado");
          })
          .catch(err => {
            console.error('Erro ao copiar os versículos:', err);
          });
      } else {
        console.log('A API Clipboard não é suportada neste navegador.');
      }
    },
    goToText(verseItem) {
      const foundBook = this.books.find(item => item.book_number === verseItem.book_number);
      this.cancelSelected()
      this.SET_BOOK(foundBook)
      this.SET_CHAPTER(verseItem.chapter)
      this.SEARCH_VERSE(verseItem)
      this.$router.push('/bible');
    },
    cancelSelected() {
      this.SEARCH_VERSE([]);
    }
  }
}
</script>

<style>

</style>
