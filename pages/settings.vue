<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header>
      <h1 class="text-lg">{{ title }}</h1>
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
        <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Exportar/Importar Preferências</span>
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600 text-sm">
          <button class="relative p-2 outline-none select-none text-left" @click.prevent="exportSettings()">
            <span class="text-sm">Exportar</span>
          </button>
          <input ref="importSets" type="file" class="hidden" @change="handleFileUpload($event)">
          <button class="relative p-2 outline-none select-none text-left" @click.prevent="importSettings()">
            <span class="text-sm">Importar</span>
          </button>
        </div>
      </div>
      <div class="flex flex-col">
        <span class="p-2 text-center font-medium text-base select-none bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">Informações</span>
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600 text-sm">
          <NuxtLink 
            to="/about"
            class="p-2 outline-none select-none text-left text-sm"
          >Sobre</NuxtLink>
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
      version: null,
      thema: null,
      font_size: null,
      font_family: null,
      versions: [
        {
          id: 'ARA',
          title: 'Almeida Revista e Atualizada - 1993',
        },
        {
          id: 'NAA',
          title: 'Nova Almeida Atualizada - 2017',
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
      fonts_size: [
        'text-xs',
        'text-sm',
        'text-base',
        'text-lg',
        'text-xl',
        'text-2xl'
      ]
    }
  },
  mounted() {
    this.updates()
  },
  methods: {
    ...mapMutations([
      'SET_VERSION',
      'SET_THEMA',
      'SET_FONT_SIZE',
      'SET_FONT_FAMILY',
      'UPDATE_FAVORITE_VERSE'
    ]),
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
    exportSettings() {
      const data = {
        version: this.getStoreState.version,
        thema: this.getStoreState.thema,
        font_size: this.getStoreState.font_size,
        font_family: this.getStoreState.font_family,
        favorite_verse: this.getStoreState.favorite_verse
      }
      const jsonString = JSON.stringify(data);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'biblia-sagrada-export.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    importSettings() {
      this.$refs.importSets.click();
    },
    handleFileUpload(event) {
      const fileReader = new FileReader();
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          this.SET_VERSION(importedSettings.version);
          this.SET_THEMA(importedSettings.thema);
          this.SET_FONT_SIZE(importedSettings.font_size);
          this.SET_FONT_FAMILY(importedSettings.font_family);
          this.FAVORITE_VERSE(importedSettings.favorite_verse);
          this.updates()
          this.$toast.success("Preferências atualizadas");
        } catch (error) {
          console.error("Error parsing JSON:", error);
          this.$toast.error("Formato incompatível");
        }
      };
    },
    updates() {
      this.updateVersion()
      this.updateThema()
      this.updateFontSize()
      this.updateFontFamily()
      this.UPDATE_FAVORITE_VERSE()
    }
  },
  computed: {
    ...mapGetters([
      'getVersion',
      'getThema',
      'getFontSize',
      'getFontFamily'
    ]),
    isFontSize() {
      const fonts = this.fonts_size;
      const fontIndex = fonts.indexOf(this.getFontSize);
      return (fontIndex * 2) + 10
    },
    getStoreState() {
      return this.$store.state
    }
  }
}
</script>

<style>

</style>
