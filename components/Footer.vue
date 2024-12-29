<template>
  <div class="footer" :style="`grid-template-columns: repeat(${menu.length}, minmax(0, 1fr));`">
    <button
      v-for="(item, index) in menu"
      :key="index"
      class="btn"
      :class="{ 'btn-active' : item.link === $route.path }"
      @click.prevent="toRouterPush(item.link)"
    >
      <component :is="item.icon" class="size-7" />
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import homeIcon from '@/static/heroicons/mini/home.svg?inline'
import bookOpenIcon from '@/static/heroicons/mini/book-open.svg?inline'
import cog8ToothIcon from '@/static/heroicons/mini/cog-8-tooth.svg?inline'
import magnifyingGlassIcon from '@/static/heroicons/mini/magnifying-glass.svg?inline'
import bookmarkIcon from '@/static/heroicons/mini/bookmark.svg?inline';

export default {
  components: { homeIcon, bookOpenIcon, cog8ToothIcon, magnifyingGlassIcon, bookmarkIcon },
  data() {
    return {
      menu: [
        { name: 'Início', link: '/', icon: 'homeIcon' },
        { name: 'Procurar', link: '/search', icon: 'magnifyingGlassIcon' },
        { name: 'Bíblia', link: '/bible', icon: 'bookOpenIcon' },
        { name: 'Favorito', link: '/favorite', icon: 'bookmarkIcon' },
        { name: 'Configurações', link: '/settings', icon: 'cog8ToothIcon' }
      ]
    }
  },
  computed: {
    ...mapGetters(['getBook', 'getChapter'])
  },
  methods: {
    ...mapMutations(['SET_BOOK', 'SET_CHAPTER']),
    async toRouterPush(link) {
      const isBiblePath = (this.$route.path === '/bible' && link === '/bible')
      if (isBiblePath && this.getBook && !this.getChapter) {
        this.SET_BOOK(null);
      } else if (isBiblePath && this.getBook && this.getChapter) {
        this.SET_CHAPTER(null);
      } else {
        this.$router.push(link);
      }
    }
  }
}
</script>

<style scoped>
.footer {
  @apply grid p-3 z-10 rounded-t-xl bg-gray-300 dark:bg-gray-700 old:bg-brown-700
}
.btn {
  @apply flex flex-col items-center justify-center space-y-1 outline-none text-gray-500 dark:text-gray-400 old:text-brown-400 select-none
}
.btn-active {
  @apply text-gray-900 dark:text-gray-50 old:text-brown-50
}
</style>
