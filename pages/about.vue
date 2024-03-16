<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header class="flex items-center space-x-2">
      <NuxtLink to="/settings" class="flex items-center cursor-pointer outline-none">
        <arrowlongleftIcon class="w-5 h-5" />
      </NuxtLink>
      <h1 class="text-lg">{{ title }}</h1>
    </Header>
    <div class="overflow-y-auto h-full">
      <div class="flex flex-col">
        <div v-for="(item, index) in abouts" :key="index" class="flex flex-col">
          <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">{{ item.title }}</span>
          <span v-if="item.type === 'text'" class="p-2 outline-none select-none text-left text-sm">{{ item.value }}</span>
          <div v-if="item.type === 'array'" class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600 text-sm">
            <span v-for="array in item.value" :key="array" class="p-2 outline-none select-none text-left text-sm">{{ array }}</span>
          </div>
          <a v-if="item.type === 'link'" :href="item.value" class="flex items-center space-x-1 p-2 outline-none select-none text-left text-sm w-fit" target="_blank" rel="noopener noreferrer">
            <span>{{ item.name }}</span>
            <newWindowIcon class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'
import newWindowIcon from '@/static/svgrepo/new-window.svg?inline'
export default {
  components: { 
    arrowlongleftIcon,
    newWindowIcon
  },
  data() {
    return {
      title: 'Sobre',
      abouts: [
        { 
          type: 'text',
          title: 'Versão',
          value: '1.0.0'
        },
        { 
          type: 'array',
          title: 'Traduções',
          value: [
            'Almeida Revista e Atualizada, 1993',
            'Nova Almeida Atualizadam, 2017',
            'Nova Tradução na Linguagem de Hoje, 2000'
          ] 
        },
        { 
          type: 'link',
          title: 'Repositório',
          name: 'GithHub',
          value: 'https://github.com/lcssxd/biblia-sagrada'
        },
        { 
          type: 'link',
          title: 'Contato',
          name: 'WhatApp',
          value: 'https://wa.me/+5583993577540/'
        }
      ]
    }
  }
}
</script>

<style>

</style>