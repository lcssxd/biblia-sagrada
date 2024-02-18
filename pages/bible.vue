<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button v-if="getBook && (getChapter || !getChapter )" class="cursor-pointer outline-none" @click.prevent="returnMenu">
          <arrowlongleftIcon class="w-5 h-5" />
        </button>
        <h1>{{ currentName }}</h1>
      </div>
      <div v-if="!getBook && !getChapter" class="flex items-center space-x-2">
        <NuxtLink to="/search">
          <magnifyingGlassIcon class="w-5 h-5" />
        </NuxtLink>
        <NuxtLink to="/favorite">
          <bookmarkIcon class="w-5 h-5" />
        </NuxtLink>
      </div>
      <div v-if="getBook && getChapter && selectedVerse && selectedVerse.length > 0" class="flex items-center space-x-3">
        <button class="cursor-pointer outline-none" @click.prevent="selectAllVerses">
          <documentCheckIcon class="w-5 h-5" />
        </button>
        <button class="cursor-pointer outline-none" @click.prevent="copyCurrentVerse">
          <clipboardDocumentIcon class="w-5 h-5" />
        </button>
        <button class="cursor-pointer outline-none" @click.prevent="favoriteVerse(selectedVerse)">
          <bookmarkSlashIcon 
            v-if="getFavoriteVerse.some(favorite => 
                favorite?.book_number === selectedVerse[0]?.book_number && 
                favorite?.chapter === selectedVerse[0]?.chapter && 
                favorite?.verse === selectedVerse[0]?.verse)" 
            class="w-5 h-5" />
          <bookmarkIcon v-else class="w-5 h-5" />
        </button>
        <button class="cursor-pointer outline-none" @click.prevent="cancelSelected">
          <xMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </Header>
    <div class="relative overflow-y-auto h-full">
      <div v-if="loading" class="h-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      <div v-if="!getBook && !loading" class="h-full">
        <div class="flex flex-col h-full">
          <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
            <h2 class="sticky top-0 p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Antigo Testamento</h2>
            <button 
              v-for="(item, index) in filteredOldTestament" :key="index"
              class="text-left font-normal p-2 outline-none select-none"
              @click.prevent="SET_BOOK(item)"
            >{{ item.name }}
            </button>
          </div>
          <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
            <h2 class="sticky top-0 p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Novo Testamento</h2>
            <button 
              v-for="(item, index) in filteredNewTestament" :key="index"
              class="text-left font-normal p-2 outline-none select-none"
              @click.prevent="SET_BOOK(item)"
            >{{ item.name }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="h-full relative">
        <div v-if="getBook && !getChapter" class="grid grid-cols-6 gap-1 p-1">
          <button
            v-for="chapter in uniqueChapters" :key="chapter.id"
            class="p-1 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 outline-none select-none"
            @click.prevent="SET_CHAPTER(chapter)"
            >{{ chapter }}
          </button>
        </div>
        <div v-if="getBook && getChapter" class="h-full">
          <div class="flex flex-col space-y-2 overflow-y-auto h-full relative">
            <div class="flex flex-col mb-auto px-2">
              <div v-for="verseItem in filteredChapter" :key="verseItem.id" class="flex flex-col">
                <span v-if="getUniqueVerseTitles(verseItem) && getUniqueVerseTitles(verseItem).length > 0" class="text-center font-bold select-none text-black dark:text-white mt-5">{{ changeTags(getUniqueVerseTitles(verseItem).join('')) }}</span>
                <button
                  v-show="verseItem.text !== ''"
                  class="text-left select-none outline-none mb-auto"
                  :class="[{ 'bg-gray-300 dark:bg-gray-600' : selectedVerse.some(verse => verse.book_number === verseItem.book_number && verse.chapter === verseItem.chapter && verse.verse === verseItem.verse) }, { 'bg-gray-300/50 dark:bg-gray-600/50' : !selectedVerse.some(verse => verse.book_number === verseItem.book_number && verse.chapter === verseItem.chapter && verse.verse === verseItem.verse) && getFavoriteVerse.some(favorite => favorite?.book_number === verseItem?.book_number && favorite?.chapter === verseItem?.chapter && favorite?.verse === verseItem?.verse) } ]"
                  @click.prevent="selectVerse(verseItem)"
                >
                  <span class="superscript">{{ verseItem.verse }}</span> <span v-html="changeTags(verseItem.text)"></span>
                </button>
              </div>
              <p class="mt-5 text-base text-gray-400 dark:text-gray-500 select-none">{{ changeTags(getDetailedInfo) }}</p>
            </div>
            <div class="flex items-center justify-between sticky bottom-2 w-full px-5">
              <button
                class="p-1 select-none outline-none transition rounded-full text-gray-800 hover:bg-gray-800 hover:text-gray-100 dark:text-gray-100 hover:dark:bg-gray-100 hover:dark:text-gray-800 disabled:bg-gray-300 disabled:text-gray-600 disabled:dark:bg-gray-300 disabled:dark:text-gray-600 shadow"
                @click.prevent="prevChapter()"
                :disabled="getChapter === 1"
              ><chevronLeftIcon class="w-5 h-5" /></button>
              <button
                class="p-1 select-none outline-none transition rounded-full text-gray-800 hover:bg-gray-800 hover:text-gray-100 dark:text-gray-100 hover:dark:bg-gray-100 hover:dark:text-gray-800 disabled:bg-gray-300 disabled:text-gray-600 shadow"
                @click.prevent="nextChapter()"
                :disabled="getChapter === uniqueChapters.length"
              ><chevronRightIcon class="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline';
import documentCheckIcon from '@/static/heroicons/mini/document-check.svg?inline';
import clipboardDocumentIcon from '@/static/heroicons/mini/clipboard-document.svg?inline';
import xMarkIcon from '@/static/heroicons/mini/x-mark.svg?inline';
import chevronLeftIcon from '@/static/heroicons/mini/chevron-left.svg?inline';
import chevronRightIcon from '@/static/heroicons/mini/chevron-right.svg?inline';
import bookmarkIcon from '@/static/heroicons/mini/bookmark.svg?inline';
import bookmarkSlashIcon from '@/static/heroicons/mini/bookmark-slash.svg?inline';
import magnifyingGlassIcon from '@/static/heroicons/mini/magnifying-glass.svg?inline'
export default {
  components: { 
    arrowlongleftIcon,
    documentCheckIcon,
    clipboardDocumentIcon,
    xMarkIcon,
    chevronLeftIcon,
    chevronRightIcon,
    bookmarkIcon,
    bookmarkSlashIcon,
    magnifyingGlassIcon,
  },
  data() {
    return {
      loading: true,
      books: null,
      info: null,
      introductions: null,
      stories: null,
      verses: null,
      filteredChapters: [],
      selectedVerse: [],
    };
  },
  async mounted() {
    await this.loadVersionFiles()
    this.UPDATE_VERSION()
    this.UPDATE_FAVORITE_VERSE()
    this.selectedSearch()
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'UPDATE_FAVORITE_VERSE', 'SET_BOOK', 'SET_CHAPTER', 'SEARCH_VERSE']),
    ...mapActions(['toggleFavoriteVerse']),
    async loadVersionFiles() {
      const version = this.getVersion;
      const [books, info, introductions, stories, verses] = await Promise.all([
        import(`@/assets/versions/books.json`),
        import(`@/assets/versions/${version}/info.json`),
        import(`@/assets/versions/${version}/introductions.json`),
        import(`@/assets/versions/${version}/stories.json`),
        import(`@/assets/versions/${version}/verses.json`)
      ]);
      this.books = books.default;
      this.info = info.default;
      this.introductions = introductions.default;
      this.stories = stories.default;
      this.verses = verses.default;
      this.loading = false;
    },
    async returnMenu() {
      if (this.getBook && !this.getChapter) {
        this.SET_BOOK(null);
      } else if (this.getBook && this.getChapter) {
        this.SET_CHAPTER(null);
        await this.loadVersionFiles();
      }
    },
    selectVerse(item) {
      const index = this.selectedVerse.findIndex(verse => verse.book_number === item.book_number && verse.chapter === item.chapter && verse.verse === item.verse);
      if (index !== -1) {
        this.selectedVerse.splice(index, 1);
      } else {
        this.selectedVerse.push(item);
      }
    },
    selectAllVerses() {
      if (this.selectedVerse.length === this.filteredChapter.length &&
          this.selectedVerse.every((verse, index) => verse === this.filteredChapter[index])) {
        this.selectedVerse = [];
      } else {
        this.selectedVerse = [...this.filteredChapter];
      }
    },
    copyCurrentVerse() {
      const sortedSelectedVerses = [...this.selectedVerse].sort((a, b) => a.verse - b.verse);

      const versesText = sortedSelectedVerses.map(verseItem => `${verseItem.verse} ${verseItem.text}`).join(' ');

      const startVerse = sortedSelectedVerses[0].verse;
      const endVerse = sortedSelectedVerses[sortedSelectedVerses.length - 1].verse;

      let verseToCopy = this.selectedVerse.length > 1
        ? `"${versesText}" (${this.currentName}:${startVerse}-${endVerse})`
        : `"${versesText}" (${this.currentName}:${startVerse})`;

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
            this.cancelSelected();
          })
          .catch(err => {
            console.error('Erro ao copiar os versículos:', err);
          });
      } else {
        console.log('A API Clipboard não é suportada neste navegador.');
      }
    },
    cancelSelected() {
      const cleanSelected = []
      this.selectedVerse = cleanSelected
      this.SEARCH_VERSE(cleanSelected)
    },
    nextChapter() {
      if(this.getChapter < this.uniqueChapters.length) {
        this.SET_CHAPTER(this.getChapter + 1)
      } else {
        this.SET_CHAPTER(null)
      }
    },
    prevChapter() {
      this.SET_CHAPTER(this.getChapter - 1)
    },
    getUniqueVerseTitles(verseItem) {
      const filteredStories = this.stories.filter(item =>
        item.book_number === verseItem.book_number &&
        item.chapter === verseItem.chapter &&
        item.verse === verseItem.verse
      );

      const uniqueTitles = [...new Set(filteredStories.map(item => item.title))];
      return uniqueTitles;
    },
    favoriteVerse(verseItem) {
      this.toggleFavoriteVerse(verseItem)
      this.cancelSelected()
    },
    selectedSearch() {
      if(this.getSearchVerse && this.getSearchVerse.length > 0) {
        this.selectedVerse = [...this.getSearchVerse]
      }
    },
    changeTags(text) {
      const styledText = text.replace(/<J>(.*?)<\/J>/g, '<span class="j-tag">$1</span>');
      const cleanedText = styledText.replace(/<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>/g, '');
      return cleanedText;
    }
  },
  computed: {
    ...mapGetters(['getVersion', 'getBook', 'getChapter', 'getFavoriteVerse', 'getSearchVerse']),
    currentName() {
      let name = 'Bíblia Sagrada';
      if(this.getBook && !this.getChapter) {
        name = this.getBook.name
      } else if(this.getBook && this.getChapter) {
        name = `${this.getBook?.name} ${this.getChapter}`
      }
      return name
    },
    filteredOldTestament() {
      return this.books ? this.books.filter(item => item.book_number <= 460) : [];
    },
    filteredNewTestament() {
      return this.books ? this.books.filter(item => item.book_number > 460) : [];
    },
    filteredVerses() {
      return this.verses && this.getBook ? this.verses.filter(item => item.book_number === this.getBook.book_number) : [];
    },
    filteredChapter() {
      if (!this.verses || !this.getBook || !this.getChapter) {
        return [];
      }

      return this.verses.filter(verseItem => 
        verseItem.book_number === this.getBook.book_number && 
        verseItem.chapter === this.getChapter
      ).map(o => ({ ...o, select: false }));
    },
    uniqueChapters() {
      const verses = this.filteredVerses;
      return [...new Set(verses.map(verseItem => verseItem.chapter))];
    },
    getDetailedInfo() {
      const info = this.info;

      const detailedInfo = info?.find(item => item.name === "detailed_info");

      if (detailedInfo) {
        return detailedInfo.value;
      } else {
        return "Informação não encontrada";
      }
    },
  }
};
</script>

<style>
.superscript {
  vertical-align: super;
  font-size: smaller;
  @apply text-gray-600 dark:text-gray-400;
}
.j-tag {
  @apply text-red-500;
}
</style>