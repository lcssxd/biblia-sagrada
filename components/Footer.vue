<template>
  <div class="grid grid-cols-4 bg-gray-700 py-1">
    <NuxtLink v-for="(item, index) in menu" :key="index" :to="item.link" class="flex flex-col items-center justify-center space-y-1 outline-none text-gray-400 transition" :exact-active-class="`active-link`">
      <component :is="item.icon" class="w-5 h-5"></component>
      <span class="text-xs font-medium truncate">{{ item.name }}</span>
    </NuxtLink>
  </div>
</template>

<script>
import bookOpenIcon from '@/static/heroicons/solid/book-open.svg?inline'
import cog8ToothIcon from '@/static/heroicons/solid/cog-8-tooth.svg?inline'
import musicalNoteIcon from '@/static/heroicons/solid/musical-note.svg?inline'
import documentIcon from '@/static/heroicons/solid/document.svg?inline'
export default {
  components: {
    bookOpenIcon,
    cog8ToothIcon,
    musicalNoteIcon,
    documentIcon,
  },
  data() {
    return {
      menu: [
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
          icon: 'documentIcon'
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
  @apply text-white
}
</style>