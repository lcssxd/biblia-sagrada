<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header>
      <span>{{ title }}</span>
    </Header>
    <div class="overflow-y-auto h-full">
      <div class="flex flex-col">
        <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Opções de Fonte</span>
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
          <button 
            v-for="(item, index) in fonts_family" :key="index"
            class="relative p-2 outline-none select-none text-left"
            @click.prevent="changeFontFamily(item.id)"
            >
            <span class="text-sm">{{ item.name }}</span>
            <div v-if="font_family === item.id" class="absolute top-3 right-2 z-0">
              <checkIcon class="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
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
          <NuxtLink 
            to="/about"
            class="p-2 outline-none select-none text-left"
            ><span class="text-sm">Sobre</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import checkIcon from '@/static/heroicons/mini/check.svg?inline'
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'

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
      fonts_family: [
        {
          id: 'font-sans',
          name: 'Padrão',
        },
        {
          id: 'font-serif',
          name: 'Serifa',
        },
        {
          id: 'font-mono',
          name: 'Mono',
        },
      ],
      version: null,
      thema: null,
      font_family: null,
    }
  },
  mounted() {
    this.updateVersion()
    this.updateThema()
    this.updateFontFamily()
  },
  methods: {
    ...mapMutations(['SET_VERSION', 'SET_THEMA', 'SET_FONT_FAMILY']),
    changeVersion(version) {
      this.SET_VERSION(version)
      this.updateVersion()
    },
    changeThema(thema) {
      this.SET_THEMA(thema)
      this.updateThema()
    },
    changeFontFamily(font) {
      this.SET_FONT_FAMILY(font)
      this.updateFontFamily()
    },
    updateVersion() {
      this.version = this.getVersion
    },
    updateThema() {
      this.thema = this.getThema
    },
    updateFontFamily() {
      this.font_family = this.getFontFamily
    },
  },
  computed: {
    ...mapGetters(['getVersion', 'getThema', 'getFontFamily']),
  }
}
</script>

<style>

</style>
