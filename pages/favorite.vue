<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header class="flex items-center space-x-2">
      <NuxtLink to="/bible" class="cursor-pointer outline-none">
        <arrowlongleftIcon class="w-5 h-5" />
      </NuxtLink>
      <span>{{ title }}</span>
    </Header>
    <div class="flex flex-col space-y-2 overflow-y-auto h-full">
      <div v-if="loading" class="h-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      <div v-for="(item, index) in filteredVerses" :key="index" class="border-b dark:border-gray-700">
        <div class="flex items-center justify-between">
          <span class="font-semibold">{{ getBookAndChapterName(item.book_id, item.chapter, item.verse) }}</span>
          <div class="flex items-center space-x-2">
            <button class="cursor-pointer outline-none" @click.prevent="copyVerse(item)">
              <clipboardDocumentIcon class="w-5 h-5" />
            </button>
            <button class="cursor-pointer outline-none" @click.prevent="toggleFavoriteVerse(item)">
              <trashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        <p class="select-none outline-none">{{ item.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'
import clipboardDocumentIcon from '@/static/heroicons/mini/clipboard-document.svg?inline';
import trashIcon from '@/static/heroicons/mini/trash.svg?inline';

export default {
  components: { arrowlongleftIcon, clipboardDocumentIcon, trashIcon },
  data() {
    return {
      title: 'Favoritos',
      loading: true,
      verse: null,
      book: null,
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
      if (!this.verse || !this.getFavoriteVerse) {
        return [];
      }

      return this.verse.filter(item => this.getFavoriteVerse.includes(item.id));
    }
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'UPDATE_FAVORITE_VERSE']),
    ...mapActions(['toggleFavoriteVerse']),
    async loadVersionFiles() {
      const version = this.getVersion;
      const [book, verse] = await Promise.all([
        import(`@/assets/versions/${version}/book.json`),
        import(`@/assets/versions/${version}/verse.json`)
      ]);
      this.book = book.default;
      this.verse = verse.default;
      this.loading = false;
    },
    getBookAndChapterName(bookId, chapter, verse) {
      if (!this.book || bookId === undefined || chapter === undefined || verse === undefined) {
        return '';
      }

      const foundBook = this.book.find(item => item.book_reference_id === bookId);

      if (!foundBook) {
        return 'Livro não encontrado';
      }

      return `${foundBook.name} ${chapter}:${verse}`;
    },
    copyVerse(verseItem) {
      let verseToCopy = `"${verseItem.text}" (${this.getBookAndChapterName(verseItem.book_id, verseItem.chapter, verseItem.verse)})`;

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
  }
}
</script>

<style>

</style>