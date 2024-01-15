<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header class="relative flex items-center justify-center">
      <button v-if="getBook && (getChapter || !getChapter )" class="absolute left-3 inset-y-0 p-2 cursor-pointer outline-none" @click.prevent="returnMenu">
        <arrowlongleftIcon class="w-5 h-5" />
      </button>
      <span>{{ currentName }}</span>
      <div v-if="getBook && getChapter && selectedVerse && selectedVerse.length > 0" class="flex space-x-3 absolute right-1 inset-y-0 p-2">
        <button class="cursor-pointer outline-none" @click.prevent="selectAllVerses">
          <documentCheckIcon class="w-5 h-5" />
        </button>
        <button class="cursor-pointer outline-none" @click.prevent="copyCurrentVerse">
          <clipboardDocumentIcon class="w-5 h-5" />
        </button>
        <button class="cursor-pointer outline-none" @click.prevent="shareVerse">
          <shareIcon class="w-5 h-5" />
        </button>
        <button class="cursor-pointer outline-none" @click.prevent="cancelSelected">
          <xMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </Header>
    <div class="relative overflow-y-auto h-full">
      <div v-if="loading" class="h-full bg-gray-700 animate-pulse"></div>
      <div v-if="!getBook && !loading" class="h-full">
        <div class="flex flex-col h-full">
          <div class="flex flex-col">
            <span class="p-2 text-center font-medium text-base select-none bg-gray-600 border-b border-gray-600">Antigo Testamento</span>
            <button 
              v-for="(item, index) in filteredOldTestament" :key="index"
              class="text-left p-2 outline-none select-none border-b border-gray-600"
              @click.prevent="SET_BOOK(item)"
              >{{ item.name }}
            </button>
          </div>
          <div class="flex flex-col">
            <span class="p-2 text-center font-medium text-base select-none bg-gray-600 border-b border-gray-600">Novo Testamento</span>
            <button 
              v-for="(item, index) in filteredNewTestament" :key="index"
              class="text-left p-2 outline-none select-none border-b border-gray-600"
              @click.prevent="SET_BOOK(item)"
              >{{ item.name }}
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="getBook && !getChapter" class="grid grid-cols-5 gap-1">
          <button
            v-for="chapter in uniqueChapters" :key="chapter.id"
            class="p-2 border border-gray-600 outline-none"
            @click.prevent="SET_CHAPTER(chapter)"
            >{{ chapter }}
          </button>
        </div>
        <div v-if="getBook && getChapter" class="space-y-3">
          <div class="overflow-y-auto">
            <button
              v-for="verseItem in filteredChapter" :key="verseItem.id"
              class="text-left select-none outline-none"
              :class="{ 'bg-gray-600' : selectedVerse.some(verse => verse.id === verseItem.id) }"
              @click.prevent="selectVerse(verseItem)"
            ><span class="superscript">{{ verseItem.verse }}</span> {{ verseItem.text }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="getBook && getChapter">
        <button class="fixed inset-y-0 left-0 my-auto h-64 flex items-center px-3 select-none outline-none transition text-transparent rounded-3xl" :class="{ 'bg-gray-600/10 text-gray-200' : chapter.prev }" @click.prevent="prevChapter()">
          <chevronDoubleLeftIcon class="w-5 h-5" />
        </button>
        <button class="fixed inset-y-0 right-0 my-auto h-64 flex items-center px-3 select-none outline-none transition text-transparent rounded-3xl" :class="{ 'bg-gray-600/10 text-gray-200' : chapter.next }" @click.prevent="nextChapter()">
          <chevronDoubleRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/outline/arrow-long-left.svg?inline';
import shareIcon from '@/static/heroicons/outline/share.svg?inline';
import documentCheckIcon from '@/static/heroicons/outline/document-check.svg?inline';
import clipboardDocumentIcon from '@/static/heroicons/outline/clipboard-document.svg?inline';
import xMarkIcon from '@/static/heroicons/outline/x-mark.svg?inline';
import chevronDoubleLeftIcon from '@/static/heroicons/outline/chevron-double-left.svg?inline';
import chevronDoubleRightIcon from '@/static/heroicons/outline/chevron-double-right.svg?inline';

export default {
  components: { arrowlongleftIcon, shareIcon, documentCheckIcon, clipboardDocumentIcon, xMarkIcon, chevronDoubleLeftIcon, chevronDoubleRightIcon, },
  data() {
    return {
      loading: true,
      book: null,
      metadata: null,
      testament: null,
      verse: null,
      filteredChapters: [],
      selectedVerse: [],
      chapter: {
        next: false,
        prev: false
      }
    };
  },
  async mounted() {
    await this.loadVersionFiles();
    this.UPDATE_VERSION();
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'SET_BOOK', 'SET_CHAPTER']),
    async loadVersionFiles() {
      const version = this.getVersion;
      const [book, metadata, testament, verse] = await Promise.all([
        import(`@/assets/versions/${version}/book.json`),
        import(`@/assets/versions/${version}/metadata.json`),
        import(`@/assets/versions/${version}/testament.json`),
        import(`@/assets/versions/${version}/verse.json`)
      ]);
      this.book = book.default;
      this.metadata = metadata.default;
      this.testament = testament.default;
      this.verse = verse.default;
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
      const index = this.selectedVerse.findIndex(verse => verse.id === item.id);
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
        ? `${versesText} - ${this.currentName}:${startVerse}-${endVerse}`
        : `${versesText} - ${this.currentName}:${startVerse}`;

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
    shareVerse() {
      const versesToShare = this.selectedVerse.map(verseItem => {
        return `"${verseItem.text}" - ${this.currentName}:${verseItem.verse}`;
      }).join('\n');

      let shareTitle = this.currentName;
      if (this.selectedVerse.length === 1) {
        shareTitle += `:${this.selectedVerse[0].verse}`;
      }

      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          text: versesToShare,
          url: window.location.href,
        })
        .then(() => {
          console.log('Conteúdo compartilhado com sucesso!');
          this.cancelSelected();
        })
        .catch((error) => console.error('Erro ao compartilhar:', error));
      } else {
        console.log('A Web Share API não é suportada neste navegador.');
      }
    },
    cancelSelected() {
      this.selectedVerse = []
    },
    nextChapter() {
      if(this.chapter.next) return 
      this.chapter.next = true
      if(this.getChapter < this.uniqueChapters.length) {
        this.SET_CHAPTER(this.getChapter + 1)
      } else {
        this.SET_CHAPTER(null)
      }
      setTimeout(() => {
        this.chapter.next = false
      }, 500)
    },
    prevChapter() {
      if(this.chapter.prev) return 
      this.chapter.prev = true
      this.SET_CHAPTER(this.getChapter - 1)
      setTimeout(() => {
        this.chapter.prev = false
      }, 500)
    }
  },
  computed: {
    ...mapGetters(['getVersion', 'getBook', 'getChapter']),
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
      return this.book ? this.book.filter(item => item.testament_reference_id === 1) : [];
    },
    filteredNewTestament() {
      return this.book ? this.book.filter(item => item.testament_reference_id === 2) : [];
    },
    filteredVerses() {
      return this.verse && this.getBook ? this.verse.filter(item => item.book_id === this.getBook.book_reference_id) : [];
    },
    filteredChapter() {
      if (!this.verse || !this.getBook || !this.getChapter) {
        return [];
      }

      return this.verse.filter(verseItem => 
        verseItem.book_id === this.getBook.book_reference_id && 
        verseItem.chapter === this.getChapter
      ).map(o => ({ ...o, select: false }));
    },
    uniqueChapters() {
      const verses = this.filteredVerses;
      return [...new Set(verses.map(verseItem => verseItem.chapter))];
    }
  }
};
</script>

<style>
.superscript {
  vertical-align: super;
  font-size: smaller;
  @apply text-gray-400;
}
</style>