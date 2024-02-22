<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header>
      <span>{{ title }}</span>
    </Header>
    <div class="overflow-y-auto h-full">
      <div class="flex flex-col">
        <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Opções de Fonte</span>
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600 text-sm">
          <div class="flex items-center justify-between p-2 outline-none select-none text-left">
            <div>
              <span>Tamanho da Fonte</span>
            </div>
            <div class="flex items-center">
              <button class="flex outline-none transition duration-100" :class="{ 'text-gray-500' : isFontSize===20 }" @click.prevent="changeFontSize('+')" :disabled="isFontSize===20">A<arrowUpIcon class="w-3 h-3" /></button>
              <span class="px-4">{{ isFontSize }}</span>
              <button class="flex outline-none transition duration-100" :class="{ 'text-gray-500' : isFontSize===10 }"  @click.prevent="changeFontSize('-')" :disabled="isFontSize===10">A<arrowDownIcon class="w-3 h-3" /></button>
            </div>
          </div>
          <button 
            v-for="(item, index) in fonts_family" :key="index"
            class="relative p-2 outline-none select-none text-left"
            @click.prevent="changeFontFamily(item.id)"
            >
            <span>{{ item.name }}</span>
            <div v-if="font_family === item.id" class="absolute top-3 right-2 z-0">
              <checkIcon class="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
      <div class="flex flex-col">
        <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Versões</span>
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600 text-sm">
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
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600 text-sm">
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
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600 text-sm">
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
import arrowUpIcon from '@/static/heroicons/mini/arrow-up.svg?inline'
import arrowDownIcon from '@/static/heroicons/mini/arrow-down.svg?inline'
export default {
  components: { checkIcon, arrowlongleftIcon, arrowUpIcon, arrowDownIcon },
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
      fonts_size: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'],
      version: null,
      thema: null,
      font_size: null,
      font_family: null,
    }
  },
  mounted() {
    this.updateVersion()
    this.updateThema()
    this.updateFontFamily()
  },
  methods: {
    ...mapMutations(['SET_VERSION', 'SET_THEMA', 'SET_FONT_SIZE', 'SET_FONT_FAMILY']),
    changeVersion(version) {
      this.SET_VERSION(version)
      this.updateVersion()
    },
    changeThema(thema) {
      this.SET_THEMA(thema)
      this.updateThema()
    },
    changeFontSize(type) {
        const fonts = this.fonts_size;
        const fontIndex = fonts.indexOf(this.getFontSize);
        let nextIndex;

        if (type === '+') {
            nextIndex = (fontIndex + 1) % fonts.length;
            if (nextIndex < fontIndex) {
                nextIndex = fontIndex;
            }
        } else {
            nextIndex = (fontIndex - 1 + fonts.length) % fonts.length;
            if (nextIndex > fontIndex) {
                nextIndex = fontIndex;
            }
        }

        this.SET_FONT_SIZE(fonts[nextIndex]);
        this.updateFontSize();
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
    updateFontSize() {
      this.font_size = this.getFontSize
    },
    updateFontFamily() {
      this.font_family = this.getFontFamily
    },
  },
  computed: {
    ...mapGetters(['getVersion', 'getThema', 'getFontSize', 'getFontFamily']),
    isFontSize() {
      const fonts = this.fonts_size;
      const fontIndex = fonts.indexOf(this.getFontSize);
      return (fontIndex * 2) + 10
    }
  }
}
</script>

<style>

</style>
