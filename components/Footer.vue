<template>
  <div class="grid grid-cols-3 bg-gray-700 text-white py-1">
    <NuxtLink v-for="(item, index) in menu" :key="index" :to="item.link" class="flex flex-col items-center justify-center space-y-1">
      <component :is="item.icon" class="w-6 h-6"></component>
      <span class="text-xs font-medium">{{ item.name }}</span>
    </NuxtLink>
  </div>
</template>

<script>
import bookOpenIcon from '@/static/heroicons/solid/book-open.svg?inline'
import cog8ToothIcon from '@/static/heroicons/solid/cog-8-tooth.svg?inline'
import homeIcon from '@/static/heroicons/solid/home.svg?inline'
export default {
  components: {
    bookOpenIcon,
    cog8ToothIcon,
    homeIcon,
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

</style>