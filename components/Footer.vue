<template>
  <div class="grid grid-cols-5 py-3">
    <NuxtLink v-for="(item, index) in menu" :key="index" :to="item.link"
      class="flex flex-col items-center justify-center space-y-1 outline-none text-gray-600 dark:text-gray-400 transition select-none"
      :exact-active-class="`active-link`"
    >
      <component :is="item.icon" class="w-5 h-5"></component>
      <!--span class="text-xs font-medium truncate">{{ item.name }}</span-->
    </NuxtLink>
  </div>
</template>

<script>
import homeIcon from '@/static/heroicons/mini/home.svg?inline'
import bookOpenIcon from '@/static/heroicons/mini/book-open.svg?inline'
import cog8ToothIcon from '@/static/heroicons/mini/cog-8-tooth.svg?inline'
import musicalNoteIcon from '@/static/heroicons/mini/musical-note.svg?inline'
import documentTextIcon from '@/static/heroicons/mini/document-text.svg?inline'
export default {
  components: {
    homeIcon,
    bookOpenIcon,
    cog8ToothIcon,
    musicalNoteIcon,
    documentTextIcon,
  },
  data() {
    return {
      menu: [
        {
          name: 'Início',
          link: '/',
          icon: 'homeIcon'
        },
        {
          name: 'Bíblia',
          link: '/biblie',
          icon: 'bookOpenIcon'
        },
        {
          name: 'Hinário',
          link: '/hymnal',
          icon: 'musicalNoteIcon'
        },
        {
          name: 'Símbolos de Fé',
          link: '/symboloffaith',
          icon: 'documentTextIcon'
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

<style>
.active-link {
  @apply text-gray-800 dark:text-white
}
</style>