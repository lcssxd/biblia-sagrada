<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header class="flex items-center justify-between">
      <h1>{{ title }}</h1>
      <button v-if="!loading && filteredVerses && filteredVerses.length > 0" class="cursor-pointer outline-none" @click.prevent="copyVerse()">
        <copyIcon class="w-5 h-5" />
      </button>
    </Header>
    <div class="flex flex-col overflow-y-auto h-full">
      <LoadingPage v-if="loading" />
      <div v-if="!loading && filteredVerses && filteredVerses.length > 0" class="flex flex-col">
        <span class="text-center font-bold select-none text-color-title mt-5">
          {{ getBookAndChapterName }}
        </span>
        <div v-for="(item, index) in filteredVerses" :key="index">
          <button class="px-2 text-left select-none outline-none" @click.prevent="goToText(item)">
            <span class="superscript">{{ item.verse }}</span> <span v-html="changeTags(item.text)"></span>
          </button>
        </div>
      </div>
      <div v-if="!loading && filteredVerses && filteredVerses.length === 0" class="flex items-center justify-center h-full text-color">
        <div class="flex flex-col items-center space-y-4">
          <noSymbolIcon class="w-16 h-16" />
          <p class="select-none">Nenhum versículo foi encontrado</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'
import copyIcon from '@/static/svgrepo/copy.svg?inline';
import noSymbolIcon from '@/static/heroicons/mini/no-symbol.svg?inline';
import LoadingPage from '~/components/Loading.vue'
export default {
  components: { arrowlongleftIcon, copyIcon, noSymbolIcon, LoadingPage },
  data() {
    return {
      title: 'Compartilhado',
      loading: true,
      verses: null,
      books: null,
      shared: []
    }
  },
  async mounted() {
    await this.loadVersionFiles();
    this.UPDATE_VERSION();
  },
  computed: {
    ...mapGetters(['getVersion']),
    currentBook() {
      return Number(this.$route.query.book);
    },
    currentChapter() {
      return Number(this.$route.query.chapter);
    },
    verseQuery() {
      return this.$route.query.verse;
    },
    getSharedVerse() {
      if(!this.currentBook || !this.currentChapter || !this.verseQuery) return
      let sharedVerses = [];
      const verseParts = this.verseQuery.split(',').map(part => part.trim());

      verseParts.forEach(part => {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let verse = start; verse <= end; verse++) {
            sharedVerses.push({
              "book_number": this.currentBook,
              "chapter": this.currentChapter,
              "verse": verse
            });
          }
        } else {
          sharedVerses.push({
            "book_number": this.currentBook,
            "chapter": this.currentChapter,
            "verse": Number(part)
          });
        }
      });

      return sharedVerses;
    },
    filteredVerses() {
      if (!this.verses || !this.currentBook || !this.currentChapter || !this.verseQuery) {
        return [];
      }

      return this.verses.filter(verseItem => 
        this.getSharedVerse.some(shared => 
          shared.book_number === verseItem.book_number && 
          shared.chapter === verseItem.chapter && 
          shared.verse === verseItem.verse
        )
      );
    },
    getBookAndChapterName() {
      if (!this.books || !this.currentBook || !this.currentChapter || !this.verseQuery) {
        return '';
      }

      const foundBook = this.books.find(item => item.book_number === this.currentBook);

      if (!foundBook) {
        return 'Livro não encontrado';
      }

      return `${foundBook.name} ${this.currentChapter}:${this.verseQuery}`;
    }
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'SET_BOOK', 'SET_CHAPTER', 'SEARCH_VERSE']),
    addSharedVerses() {
      const verseParts = this.verseQuery.split(',').map(part => part.trim());

      verseParts.forEach(part => {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let verse = start; verse <= end; verse++) {
            this.shared.push({
              "book_number": this.currentBook,
              "chapter": this.currentChapter,
              "verse": verse
            });
          }
        } else {
          this.shared.push({
            "book_number": this.currentBook,
            "chapter": this.currentChapter,
            "verse": Number(part)
          });
        }
      });
    },
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
    copyVerse() {
      const sortedSelectedVerses = [...this.filteredVerses].sort((a, b) => a.verse - b.verse);
      const versesText = this.removeTags(sortedSelectedVerses.map(verseItem => `${verseItem.verse} ${verseItem.text}`).join(' '));
      const verseToCopy = `"${versesText}" (${this.getBookAndChapterName})`;

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
    changeTags(text) {
      const styledText = text.replace(/<J>(.*?)<\/J>/g, '<span class="j-tag">$1</span>');
      const cleanedText = styledText.replace(/<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>/g, '').replace(/\s{2,}/g, ' ');
      return cleanedText;
    },
    removeTags(text) {
      const cleanedText = text.replace(/<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>|<J>|<\/J>/g, '').replace(/\s{2,}/g, ' ');
      return cleanedText;
    },
    cancelSelected() {
      this.SEARCH_VERSE([]);
    },
  }
}
</script>

<style>

</style>