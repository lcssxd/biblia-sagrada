<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button v-if="getBook && (getChapter || !getChapter )" class="cursor-pointer outline-none" @click.prevent="returnMenu">
          <arrowlongleftIcon class="w-5 h-5" />
        </button>
        <h1 class="text-lg">{{ currentName }}</h1>
      </div>
      <Transition name="fade" mode="out-in">
        <div v-if="getBook && getChapter && selectedVerse && selectedVerse.length > 0" class="flex items-center space-x-3">
          <button class="outline-none" @click.prevent="selectAllVerses">
            <selectAllIcon class="w-5 h-5" />
          </button>
          <button class="outline-none" @click.prevent="copyCurrentVerse">
            <copyIcon class="w-5 h-5" />
          </button>
          <button class="outline-none" @click.prevent="favoriteVerse(selectedVerse)">
            <bookmarkSlashIcon 
              v-if="getFavoriteVerse.some(favorite => 
                  favorite?.book_number === selectedVerse[0]?.book_number && 
                  favorite?.chapter === selectedVerse[0]?.chapter && 
                  favorite?.verse === selectedVerse[0]?.verse)" 
              class="w-5 h-5" />
            <bookmarkIcon v-else class="w-5 h-5" />
          </button>
          <button class="outline-none" @click.prevent="shareVerse">
            <shareIcon class="w-5 h-5" />
          </button>
          <button class="outline-none" @click.prevent="cancelSelected">
            <xMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </Transition>
    </Header>
    <div class="relative overflow-y-auto h-full">
      <LoadingPage v-if="loading" />
      <Transition v-else name="fade" mode="out-in">
        <div class="h-full" :key="currentChapterKey">
          <div v-if="!getBook && !loading" class="h-full">
            <div class="flex flex-col h-full">
              <div class="divider-y">
                <h2 class="sticky top-0 title">Antigo Testamento</h2>
                <button 
                  v-for="(item, index) in filteredOldTestament" :key="index"
                  class="text-left font-normal p-2 outline-none select-none"
                  @click.prevent="SET_BOOK(item)"
                >{{ item.name }}
                </button>
              </div>
              <div class="divider-y">
                <h2 class="sticky top-0 title">Novo Testamento</h2>
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
                class="btn-chapter"
                @click.prevent="SET_CHAPTER(chapter)"
                >{{ chapter }}
              </button>
            </div>
            <div v-if="getBook && getChapter" class="h-full">
              <div class="flex flex-col space-y-2 overflow-y-auto h-full relative" ref="scrollContainer">
                <div class="flex flex-col mb-auto">
                  <div v-for="verseItem in filteredChapter" :key="verseItem.id" class="flex flex-col">
                    <span 
                      v-if="getUniqueVerseTitles(verseItem) && getUniqueVerseTitles(verseItem).length > 0"
                      class="text-center font-bold select-none text-color-title mt-5"
                    >{{ removeTagsTitle(getUniqueVerseTitles(verseItem).join('')) }}</span>
                    <button
                      v-show="verseItem.text !== ''"
                      class="px-2 text-left select-none outline-none mb-auto transition duration-200"
                      :class="[{ 'selected-verse' : selectedVerse.some(verse => verse.book_number === verseItem.book_number && verse.chapter === verseItem.chapter && verse.verse === verseItem.verse) }, { 'favorited-verse' : !selectedVerse.some(verse => verse.book_number === verseItem.book_number && verse.chapter === verseItem.chapter && verse.verse === verseItem.verse) && getFavoriteVerse.some(favorite => favorite?.book_number === verseItem?.book_number && favorite?.chapter === verseItem?.chapter && favorite?.verse === verseItem?.verse) }]"
                      :ref="'verse-' + verseItem.chapter + '-' + verseItem.verse"
                      @click.prevent="selectVerse(verseItem)"
                    >
                      <span class="superscript">{{ verseItem.verse }}</span> <span v-html="changeTags(verseItem.text)"></span>
                    </button>
                  </div>
                  <p class="mt-5 px-2 text-base text-gray-400 dark:text-gray-500 old:text-brown-700 select-none">{{ getCopyright }}</p>
                </div>
                <div class="flex items-center justify-between sticky bottom-2 w-full px-5">
                  <button
                    class="btn-prev-next"
                    :class="{ 'invisible' : isFistChapter }"
                    @click.prevent="prevChapter()"
                  ><chevronLeftIcon class="w-6 h-6" /></button>
                  <button
                    class="btn-prev-next"
                    :class="{ 'invisible' : isLastChapter }"
                    @click.prevent="nextChapter()"
                  ><chevronRightIcon class="w-6 h-6" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline';
import selectAllIcon from '@/static/svgrepo/select-all.svg?inline';
import copyIcon from '@/static/svgrepo/copy.svg?inline';
import xMarkIcon from '@/static/heroicons/mini/x-mark.svg?inline';
import chevronLeftIcon from '@/static/heroicons/mini/chevron-left.svg?inline';
import chevronRightIcon from '@/static/heroicons/mini/chevron-right.svg?inline';
import bookmarkIcon from '@/static/heroicons/mini/bookmark.svg?inline';
import bookmarkSlashIcon from '@/static/heroicons/mini/bookmark-slash.svg?inline';
import shareIcon from '@/static/heroicons/mini/share.svg?inline';
import LoadingPage from '~/components/Loading.vue'
export default {
  components: { 
    arrowlongleftIcon,
    selectAllIcon,
    copyIcon,
    xMarkIcon,
    chevronLeftIcon,
    chevronRightIcon,
    bookmarkIcon,
    bookmarkSlashIcon,
    shareIcon,
    LoadingPage
  },
  data() {
    return {
      loading: true,
      books: null,
      info: null,
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
  watch: {
    getChapter(val) {
      this.$nextTick(() => {
        this.scrollToTopOfDiv();
        this.cancelSelected();
      });
    }
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'UPDATE_FAVORITE_VERSE', 'SET_BOOK', 'SET_CHAPTER', 'SEARCH_VERSE']),
    ...mapActions(['toggleFavoriteVerse']),
    async loadVersionFiles() {
      const version = this.getVersion;
      const [books, db] = await Promise.all([
        import(`@/assets/json/books.json`),
        import(`@/assets/json/db.json`)
      ]);
      this.books = books.default;
      let copyright = db.default.versions.find(item => item.abbrev == version).copyright
      this.copyright = copyright

      if (this.isACFVersion) {
        const verses = await import(`@/assets/json/versions/${version}/verses.json`);
        this.verses = verses.default;
      } else {
        const [stories, verses] = await Promise.all([
          import(`@/assets/json/versions/${version}/stories.json`),
          import(`@/assets/json/versions/${version}/verses.json`)
        ]);
        this.stories = stories.default;
        this.verses = verses.default;
      }

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
      const versesText = this.removeTags(sortedSelectedVerses.map(verseItem => `${verseItem.verse} ${verseItem.text}`).join(' '));

      let referenceGroups = [];
      let currentGroup = [];
      sortedSelectedVerses.forEach((verse, index) => {
        if (currentGroup.length === 0) {
          currentGroup.push(verse.verse);
        } else {
          const lastVerseInGroup = currentGroup[currentGroup.length - 1];
          if (verse.verse === lastVerseInGroup + 1) {
            currentGroup.push(verse.verse);
          } else {
            referenceGroups.push(currentGroup);
            currentGroup = [verse.verse];
          }
        }
        if (index === sortedSelectedVerses.length - 1) {
          referenceGroups.push(currentGroup);
        }
      });

      const reference = referenceGroups.map(group => {
        return group.length > 1 ? `${group[0]}-${group[group.length - 1]}` : `${group[0]}`;
      }).join(', ');

      const verseToCopy = `"${versesText}" (${this.currentName}:${reference})`;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(verseToCopy)
          .then(() => {
            this.$toast.success("Copiado");
            this.cancelSelected();
          })
          .catch(err => {
            console.error('Erro ao copiar os versículos:', err);
          });
      } else {
        console.log('A API Clipboard não é suportada neste navegador.');
      }
    },
    async shareVerse() {
      const bookNumber = this.getBook?.book_number;
      const chapterNumber = this.getChapter;
      const sortedSelectedVerses = [...this.selectedVerse].sort((a, b) => a.verse - b.verse);
      const versesText = this.removeTags(sortedSelectedVerses.map(verseItem => `${verseItem.verse} ${verseItem.text}`).join(' '));

      let referenceGroups = [];
      let currentGroup = [];
      sortedSelectedVerses.forEach((verse, index) => {
        if (currentGroup.length === 0) {
          currentGroup.push(verse.verse);
        } else {
          const lastVerseInGroup = currentGroup[currentGroup.length - 1];
          if (verse.verse === lastVerseInGroup + 1) {
            currentGroup.push(verse.verse);
          } else {
            referenceGroups.push(currentGroup);
            currentGroup = [verse.verse];
          }
        }
        if (index === sortedSelectedVerses.length - 1) {
          referenceGroups.push(currentGroup);
        }
      });

      const reference = referenceGroups.map(group => {
        return group.length > 1 ? `${group[0]}-${group[group.length - 1]}` : `${group[0]}`;
      }).join(',');

      const verseToCopy = `"${versesText}" (${this.currentName}:${reference})`;

      const shareURL = `${window.location.origin}/shared?book=${bookNumber}&chapter=${chapterNumber}&verse=${reference}`;

      const shareData = {
        title: `(${this.currentName}:${reference})`,
        text: verseToCopy,
        url: shareURL,
      };

      try {
        await navigator.share(shareData);
        this.cancelSelected();
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    },
    cancelSelected() {
      this.selectedVerse = []
      this.SEARCH_VERSE(this.selectedVerse);
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
    scrollToTopOfDiv() {
      const scrollContainer = this.$refs.scrollContainer;
      if (scrollContainer && scrollContainer.scrollTop > 0) {
        scrollContainer.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    },
    getUniqueVerseTitles(verseItem) {
      if(this.isACFVersion) return;
      const filteredStories = this.stories?.filter(item =>
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
        this.scrollToSelectedVerse();
      }
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
    removeTagsTitle(text) {
      const cleanedText = text.replace(/<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>|<J>|<\/J>|—|;|,/g, '').replace(/\s{2,}/g, ' ');
      return cleanedText;
    },
    scrollToSelectedVerse() {
      this.$nextTick(() => {
        if(this.selectedVerse && this.selectedVerse.length > 0) {
          const selectedRef = 'verse-' + this.selectedVerse[0].chapter + '-' + this.selectedVerse[0].verse;
          const verseElement = this.$refs[selectedRef];

          if(verseElement && verseElement[0]) {
            const scrollContainer = this.$refs.scrollContainer;
            const verseTop = verseElement[0].offsetTop;

            if(scrollContainer) {
              scrollContainer.scrollTo({
                top: verseTop,
                behavior: 'smooth'
              });
            }
          }
        }
      });
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
    getCopyright() {
      if (this.copyright) {
        let details = this.copyright;
        return `${details} Todos os direitos reservados.`;
      } else {
        return "Informação não encontrada";
      }
    },
    currentChapterKey() {
      return `${this.getBook?.book_number}-${this.getChapter}`;
    },
    isFistChapter() {
      return this.getChapter === 1 ? true : false
    },
    isLastChapter() {
      return this.getChapter === this.uniqueChapters.length ? true : false
    },
    isACFVersion() {
      return this.getVersion === 'ACF' ? true : false
    }
  }
};
</script>

<style scoped>
.btn-chapter {
  @apply p-1 rounded-md bg-gray-200 dark:bg-gray-700 old:bg-brown-300 border border-gray-300 dark:border-gray-600 old:border-brown-500 outline-none select-none
}
.btn-prev-next {
  @apply p-2 select-none outline-none transition duration-200 rounded-full text-gray-800 hover:bg-gray-800/30 dark:text-gray-50 hover:dark:bg-gray-100/30 old:text-brown-800 hover:old:bg-brown-800/30
}
</style>