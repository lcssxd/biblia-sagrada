<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header class="flex items-center space-x-2">
      <NuxtLink to="/settings" class="flex items-center cursor-pointer outline-none">
        <arrowlongleftIcon class="w-5 h-5" />
      </NuxtLink>
      <span>{{ title }}</span>
    </Header>
    <div class="space-y-3 px-2">
      <div v-for="(item, index) in abouts" :key="index">
        <h2 class="font-semibold text-lg select-none">{{ item.name }}</h2>
        <span v-for="(obj, index) in item.desc" :key="index" class="flex flex-col">
          <span v-if="obj != abouts[3].desc[0]" class="text-sm" :class="{ 'select-none' : obj != abouts[3].desc[0] }">{{ obj }}</span>
          <a v-else :href="obj" class="text-sm w-fit" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'
export default {
  components: { arrowlongleftIcon },
  data() {
    return {
      title: 'Sobre',
      abouts: [
        {
          name: 'Versão',
          desc: ['1.0.0']
        },
        {
          name: 'Traduções',
          desc: ['Almeida Revista e Atualizada (ARA)', 'Nova Tradução na Linguagem de Hoje (NTLH)']
        },
        {
          name: 'Desenvolvedor',
          desc: ['Luan Soares']
        },
        {
          name: 'Contato',
          desc: ['https://wa.me/+5583993577540/']
        }
      ]
    }
  }
}
</script>

<style>

</style>