<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header>
      <h1 class="text-lg">{{ title }}</h1>
    </Header>
    <div class="flex flex-col overflow-y-auto h-full">
      <div v-if="loading" class="h-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      <div v-if="!loading && filteredVerses && filteredVerses.length > 0" class="divide-y divide-gray-200 dark:divide-gray-600">
        <div v-for="(item, index) in filteredVerses" :key="index" class="p-2">
          <div class="flex items-center justify-between">
            <span class="font-semibold select-none">{{ getBookAndChapterName(item.book_number, item.chapter, item.verse) }}</span>
            <div class="flex items-center space-x-2">
              <button class="cursor-pointer outline-none" @click.prevent="copyVerse(item)">
                <copyIcon class="w-5 h-5" />
              </button>
              <button class="cursor-pointer outline-none" @click.prevent="toggleFavoriteVerse(item)">
                <trashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          <button class="select-none text-left" @click.prevent="goToText(item)"><span v-html="changeTags(item.text)"></span></button>
        </div>
      </div>
      <div v-if="!loading && filteredVerses && filteredVerses.length === 0" class="flex items-center justify-center h-full text-gray-800 dark:text-gray-50">
        <div class="flex flex-col items-center space-y-4">
          <bookmarkIcon class="w-16 h-16" />
          <p class="text-lg select-none">Nenhum versículo salvo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'
import copyIcon from '@/static/svgrepo/copy.svg?inline';
import trashIcon from '@/static/heroicons/mini/trash.svg?inline';
import bookmarkIcon from '@/static/heroicons/mini/bookmark.svg?inline';
export default {
  components: { arrowlongleftIcon, copyIcon, trashIcon, bookmarkIcon },
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
    this.UPDATE_FAVORITE_VERSE();
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
    ...mapMutations(['UPDATE_VERSION', 'UPDATE_FAVORITE_VERSE', 'SET_BOOK', 'SET_CHAPTER']),
    ...mapActions(['toggleFavoriteVerse']),
    async loadVersionFiles() {
      const version = this.getVersion;
      const [books, verses] = await Promise.all([
        import(`@/assets/versions/books.json`),
        import(`@/assets/versions/${version}/verses.json`)
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
      let verseToCopy = `"${this.removeTags(verseItem.text)}" (${this.getBookAndChapterName(verseItem.book_number, verseItem.chapter, verseItem.verse)})`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(verseToCopy)
          .then(() => {
            this.$toast.success("Copiado!", {
              position: "top-right",
              timeout: 3000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
              draggable: true,
              draggablePercent: 0.6,
              showCloseButtonOnHover: false,
              hideProgressBar: true,
              closeButton: "button",
              icon: true,
              rtl: false
            });
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
      this.SET_BOOK(foundBook)
      this.SET_CHAPTER(verseItem.chapter)
      this.$router.push('/bible');
    },
    changeTags(text) {
      const styledText = text.replace(/<J>(.*?)<\/J>/g, '<span class="j-tag">$1</span>');
      const cleanedText = styledText.replace(/<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>/g, '').replace(/\s{2,}/g, ' ');
      return cleanedText;
    },
    removeTags(text) {
      const cleanedText = text.replace(/<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>|<J>|<\/J>/g, '').replace(/\s{2,}/g, ' ');
      return cleanedText;
    }
  }
}
</script>

<style>

</style>