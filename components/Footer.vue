<template>
  <div class="grid py-3" :style="`grid-template-columns: repeat(${menu.length}, minmax(0, 1fr));`">
    <NuxtLink v-for="(item, index) in menu" :key="index" :to="item.link" class="btn" :exact-active-class="`btn-active`">
      <component :is="item.icon" class="w-6 h-6" />
    </NuxtLink>
  </div>
</template>

<script>
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
        {
          name: 'Início',
          link: '/',
          icon: 'homeIcon'
        },
        {
          name: 'Procurar',
          link: '/search',
          icon: 'magnifyingGlassIcon'
        },
        {
          name: 'Bíblia',
          link: '/bible',
          icon: 'bookOpenIcon'
        },
        {
          name: 'Favorito',
          link: '/favorite',
          icon: 'bookmarkIcon'
        },
        {
          name: 'Configurações',
          link: '/settings',
          icon: 'cog8ToothIcon'
        }
      ]
    }
  }
}
</script>

<style scoped>
.btn {
  @apply flex flex-col items-center justify-center space-y-1 outline-none text-gray-600 dark:text-gray-400 old:text-brown-700 transition duration-200 select-none
}
.btn-active {
  @apply text-gray-800 dark:text-white old:text-brown-900
}
</style>