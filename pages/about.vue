<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header>
      <NuxtLink to="/settings" class="flex items-center space-x-2 cursor-pointer outline-none w-fit">
        <arrowlongleftIcon class="size-5" />
        <h1>{{ title }}</h1>
      </NuxtLink>
    </Header>
    <div class="overflow-y-auto h-full">
      <div class="flex flex-col">
        <div v-for="(item, index) in abouts" :key="index" class="flex flex-col">
          <div class="title">{{ item.title }}</div>
          <span v-if="item.type === 'text'" class="p-2 outline-none select-none text-left">{{ item.value }}</span>
          <div v-if="item.type === 'array'" class="divider-y">
            <span v-for="array in item.value" :key="array" class="p-2 outline-none select-none text-left">{{ array }}</span>
          </div>
          <a
            v-if="item.type === 'link'"
            :href="item.value"
            class="flex items-center space-x-1 p-2 outline-none select-none text-left w-fit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{{ item.name }}</span>
            <newWindowIcon class="size-3" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'
import newWindowIcon from '@/static/svgrepo/new-window.svg?inline'
import db from '~/assets/json/db.json'

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
          value: '3.0.0'
        },
        {
          type: 'array',
          title: 'Traduções',
          value: []
        },
        {
          type: 'link',
          title: 'Repositório',
          name: 'GitHub',
          value: 'https://github.com/lcssxd/biblia-sagrada'
        },
        {
          type: 'link',
          title: 'Contato',
          name: 'WhatsApp',
          value: 'https://wa.me/+5583993577540/'
        }
      ]
    }
  },
  mounted() {
    this.abouts.find(item => item.type === 'array').value = db.versions.map(version => version.description)
  }
}
</script>

<style>

</style>
