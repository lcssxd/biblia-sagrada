<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header class="flex items-center space-x-2">
      <NuxtLink to="/settings" class="flex items-center cursor-pointer outline-none">
        <arrowlongleftIcon class="w-5 h-5" />
      </NuxtLink>
      <span>{{ title }}</span>
    </Header>
    <div class="space-y-3">
      <div v-for="(item, index) in abouts" :key="index">
        <h2 class="font-semibold text-lg select-none">{{ item.name }}</h2>
        <p v-for="obj in item.desc" :key="obj" :class="{ 'select-none' : obj != abouts[2].desc[1] }">{{ obj }}</p>
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
          name: 'Contato',
          desc: ['Luan Soares', 'WhatsApp: +5583993577540']
        }
      ]
    }
  }
}
</script>

<style>

</style>