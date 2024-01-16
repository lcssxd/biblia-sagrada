<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header>
      <span>{{ title }}</span>
    </Header>
    <div class="overflow-y-auto h-full">
      <div class="flex flex-col">
        <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Versões</span>
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
          <button 
            v-for="(item, index) in versions" :key="index"
            class="relative p-2 outline-none select-none text-left"
            @click.prevent="changeVersion(item.id)"
            >
            <span class="text-sm">{{ item.id }} - {{ item.title }}</span>
            <div v-if="version === item.id" class="absolute top-3 right-2 z-0">
              <checkIcon class="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
      <div class="flex flex-col">
        <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Temas</span>
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
          <button 
            v-for="(item, index) in themas" :key="index"
            class="relative p-2 outline-none select-none text-left"
            @click.prevent="changeThema(item.id)"
            >
            <span class="text-sm">{{ item.name }}</span>
            <div v-if="thema === item.id" class="absolute top-3 right-2 z-0">
              <checkIcon class="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
      <div class="flex flex-col">
        <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Informações</span>
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
          <button 
            class="p-2 outline-none select-none text-left"
            ><span class="text-sm">Sobre</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import checkIcon from '@/static/heroicons/outline/check.svg?inline'
import arrowlongleftIcon from '@/static/heroicons/outline/arrow-long-left.svg?inline'

export default {
  components: { checkIcon, arrowlongleftIcon },
  data() {
    return {
      title: 'Configurações',
      versions: [
        {
          id: 'ARA',
          title: 'Almeida Revista e Atualizada - 1993',
        },
        {
          id: 'NTLH',
          title: 'Nova Tradução na Linguagem de Hoje - 1988',
        }
      ],
      themas: [
        {
          id: 'light',
          name: 'Claro',
        },
        {
          id: 'dark',
          name: 'Escuro',
        }
      ],
      version: null,
      thema: null,
    }
  },
  mounted() {
    this.updateVersion()
    this.updateThema()
  },
  methods: {
    ...mapMutations(['SET_VERSION', 'SET_THEMA']),
    changeVersion(version) {
      this.SET_VERSION(version)
      this.updateVersion()
    },
    changeThema(thema) {
      this.SET_THEMA(thema)
      this.updateThema()
    },
    updateVersion() {
      this.version = this.getVersion
    },
    updateThema() {
      this.thema = this.getThema
    },
  },
  computed: {
    ...mapGetters(['getVersion', 'getThema']),
  }
}
</script>

<style>

</style>
