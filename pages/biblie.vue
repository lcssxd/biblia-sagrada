<template>
  <div class="flex flex-col h-screen justify-between overflow-hidden">
    <div class="relative flex items-center justify-center font-semibold bg-gray-700 py-4 w-full select-none">
      <button v-if="currentBook && (currentChapter || !currentChapter )" class="absolute left-3 inset-y-0 p-2 cursor-pointer outline-none" @click.prevent="returnMenu">
        <arrowlongleftIcon class="w-5 h-5" />
      </button>
      <span>{{ currentName }}</span>
    </div>
    <div class="overflow-y-auto h-full">
      <div v-if="!currentBook" class="h-full">
        <div class="flex flex-col h-full">
          <div class="flex flex-col">
            <span class="p-2 text-center font-medium text-base select-none bg-gray-600 border-b border-gray-600">Antigo Testamento</span>
            <button 
              v-for="(item, index) in filteredOldTestament" :key="index"
              class="p-2 outline-none select-none border-b border-gray-600"
              @click.prevent="selectBook(item)"
              >{{ item.name }}
            </button>
          </div>
          <div class="flex flex-col">
            <span class="p-2 text-center font-medium text-base select-none bg-gray-600 border-b border-gray-600">Novo Testamento</span>
            <button 
              v-for="(item, index) in filteredNewTestament" :key="index"
              class="p-2 outline-none select-none border-b border-gray-600"
              @click.prevent="selectBook(item)"
              >{{ item.name }}
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="currentBook && !currentChapter" class="grid grid-cols-5 gap-1">
          <button
            v-for="chapter in uniqueChapters" :key="chapter.id"
            class="p-2 border border-gray-600 outline-none"
            @click.prevent="currentChapter = chapter"
            >{{ chapter }}
          </button>
        </div>
        <div v-if="currentBook && currentChapter" class="space-y-3">
          <div v-if="currentBook && currentChapter" class="overflow-y-auto">
            <button v-for="verseItem in filteredChapter" :key="verseItem.id" class="text-left select-none outline-none" :class="{ 'bg-gray-600' : verseItem?.select }" @click.prevent="verseItem.select = !verseItem.select">
              <span class="superscript">{{ verseItem.verse }}</span> {{ verseItem.text }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--div class="flex items-center justify-center font-semibold bg-gray-500 py-4 w-full select-none">Versão {{ metadata[2].value }}</div-->
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import arrowlongleftIcon from '@/static/heroicons/outline/arrow-long-left.svg?inline';
import book from '@/assets/ARA/book.json';
import metadata from '@/assets/ARA/metadata.json';
import testament from '@/assets/ARA/testament.json';
import verse from '@/assets/ARA/verse.json';
export default {
  components: { arrowlongleftIcon },
  data() {
    return {
      book: book,
      metadata: metadata,
      testament: testament,
      verse: verse,
      currentBook: null,
      currentChapter: null,
    };
  },
  methods: {
    ...mapMutations({
      setCurrentBook: 'setCurrentBook',
      setCurrentChapter: 'setCurrentChapter',
    }),
    selectBook(item) {
      if(!this.currentBook) {
        this.currentBook = item
      } else if(this.currentBook && this.currentBook.name != item.name) {
        this.currentBook = item
        this.currentChapter = null
      } else {
        this.currentBook = null,
        this.currentChapter = null
      }
    },
    returnMenu() {
      if(this.currentBook) {
        if(!this.currentChapter) {
          this.currentBook = null
        } else if(this.currentChapter) {
          this.currentChapter = null
        }
      }
    }
  },
  computed: {
    currentName() {
      let name;
      if(this.currentBook && !this.currentChapter) {
        name = this.currentBook.name
      } else if(this.currentBook && this.currentChapter) {
        name = `${this.currentBook.name} ${this.currentChapter}`
      } else {
        name = 'Bíblia Sagrada'
      }
      return name
    },
    filteredOldTestament() {
      if (!this.book) {
        return [];
      }
      return this.book.filter(bookItem => bookItem.testament_reference_id === 1);
    },
    filteredNewTestament() {
      if (!this.book) {
        return [];
      }
      return this.book.filter(bookItem => bookItem.testament_reference_id === 2);
    },
    filteredVerses() {
      if (!this.verse || !this.currentBook) {
        return [];
      }
      return this.verse.filter(verseItem => verseItem.book_id === this.currentBook.book_reference_id);
    },
    filteredChapter() {
      if (!this.verse || !this.currentBook || !this.currentChapter) {
        return [];
      }
      let verse = []

      verse = this.verse.filter(verseItem => 
        verseItem.book_id === this.currentBook.book_reference_id && 
        verseItem.chapter === this.currentChapter
      );
      return this.verse = verse.map(o => ({ ...o, select: false }))
    },
    uniqueChapters() {
      const verses = this.filteredVerses;
      const chapters = verses.map(verseItem => verseItem.chapter);
      return [...new Set(chapters)];
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