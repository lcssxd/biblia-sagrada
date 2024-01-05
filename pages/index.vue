<template>
  <div class="flex flex-col h-screen justify-between overflow-hidden text-gray-50 bg-gray-900">
    <div class="relative flex items-center justify-center font-semibold bg-gray-500 py-4 w-full select-none">
      <button v-if="currentBook && (currentChapter || !currentChapter )" class="absolute left-3 inset-y-0 p-2 cursor-pointer outline-none" @click.prevent="returnMenu">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z" clip-rule="evenodd" />
        </svg>
      </button>
      Bíblia Sagrada
    </div>
    <div class="mb-6 p-6 overflow-y-auto h-full">
      <div v-if="!currentBook" class="h-full">
        <div class="flex flex-col space-y-1 h-full">
          <div class="flex flex-col space-y-1">
            <span class="p-2 bg-green-600 rounded text-center font-medium text-base select-none">Antigo Testamento</span>
            <button 
              v-for="(item, index) in filteredOldTestament" :key="index"
              class="p-2 bg-blue-600 rounded outline-none select-none"
              @click.prevent="selectBook(item)"
              >{{ item.name }}
            </button>
          </div>
          <div class="flex flex-col space-y-1">
            <span class="p-2 bg-green-600 rounded text-center font-medium text-base select-none">Novo Testamento</span>
            <button 
              v-for="(item, index) in filteredNewTestament" :key="index"
              class="p-2 bg-blue-600 rounded outline-none select-none"
              @click.prevent="selectBook(item)"
              >{{ item.name }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="currentBook && !currentChapter" class="grid grid-cols-4 md:grid-cols-6 gap-1">
        <button
          v-for="chapter in uniqueChapters" :key="chapter.id"
          class="p-2 bg-blue-600 rounded outline-none"
          @click.prevent="currentChapter = chapter"
          >{{ chapter }}
        </button>
      </div>
      <div v-if="currentBook && currentChapter" class="space-y-3">
        <h3 class="text-2xl font-semibold">{{ currentBook?.name }} {{ currentChapter }}</h3>
        <div v-if="currentBook && currentChapter" class="overflow-y-auto">
          <p v-for="verseItem in filteredChapter" :key="verseItem.id" class="select-all">
            <span class="superscript">{{ verseItem.verse }}</span> {{ verseItem.text }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center font-semibold bg-gray-500 py-4 w-full select-none">Versão {{ metadata[2].value }}</div>
  </div>
</template>

<script>
import book from '@/assets/ARA/book.json';
import metadata from '@/assets/ARA/metadata.json';
import testament from '@/assets/ARA/testament.json';
import verse from '@/assets/ARA/verse.json';
export default {
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
      return this.verse.filter(verseItem => 
        verseItem.book_id === this.currentBook.book_reference_id && 
        verseItem.chapter === this.currentChapter
      );
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