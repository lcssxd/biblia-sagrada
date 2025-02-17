<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header>
      <h1>{{ title }}</h1>
    </Header>
    <div class="overflow-y-auto h-full">
      <div class="flex flex-col">
        <div class="title">Opções de Fonte</div>
        <div class="divider-y">
          <div class="flex items-center justify-between p-2 outline-none select-none text-left">
            <div>
              <span>Tamanho da Fonte</span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                class="btn-font text-xs"
                :class="{ 'disabled-btn-font' : isFontSizeMin }"
                @click.prevent="changeFontSize('decrease')"
                :disabled="isFontSizeMin"
              ><span class="absolute bottom-1 inset-x-0">A</span></button>
              <button
                class="btn-font text-lg"
                :class="{ 'disabled-btn-font' : isFontSizeMax }"
                @click.prevent="changeFontSize('increase')"
                :disabled="isFontSizeMax"
              ><span class="absolute bottom-0 inset-x-0">A</span></button>
            </div>
          </div>
          <select v-model="fontFamily" @change="changeFontFamily(fontFamily)">
            <option v-for="(item, index) in fontsFamily" :key="index" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="title">Versões</div>
        <select v-model="version" @change="changeVersion(version)">
          <option v-for="(item, index) in versions" :key="index" :value="item.abbrev">
            {{ item.abbrev }} - {{ item.description }}
          </option>
        </select>
      </div>
      <div class="flex flex-col">
        <div class="title">Temas</div>
        <select v-model="theme" @change="changeTheme(theme)">
          <option v-for="(item, index) in themes" :key="index" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-col">
        <div class="title">Preferências</div>
        <div class="divider-y">
          <button class="relative p-2 outline-none select-none text-left" @click.prevent="exportSettings()">
            <span>Exportar</span>
          </button>
          <input ref="importSets" type="file" class="hidden" @change="handleFileUpload($event)">
          <button class="relative p-2 outline-none select-none text-left" @click.prevent="importSettings()">
            <span>Importar</span>
          </button>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="title">Informações</div>
        <div class="divider-y">
          <NuxtLink
            to="/about"
            class="p-2 outline-none select-none text-left"
          >Sobre</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import db from '~/assets/json/db.json'

export default {
  data() {
    return {
      title: 'Configurações',
      version: null,
      theme: null,
      fontSize: null,
      fontFamily: null,
      versions: [],
      themes: [],
      fontsFamily: [],
      fontsSize: null
    }
  },
  mounted() {
    this.getDBSets()
    this.updates()
  },
  methods: {
    ...mapMutations([
      'SET_VERSION',
      'SET_THEME',
      'SET_FONT_SIZE',
      'SET_FONT_FAMILY',
      'FAVORITE_VERSES',
      'UPDATE_FAVORITE_VERSES'
    ]),
    changeVersion(version) {
      this.SET_VERSION(version)
      this.updateVersion()
    },
    changeTheme(theme) {
      this.SET_THEME(theme)
      this.updateTheme()
    },
    changeFontSize(action) {
      this.SET_FONT_SIZE(this.fontSize + (action === 'increase' ? 2 : -2));
      this.updateFontSize();
    },
    changeFontFamily(font) {
      this.SET_FONT_FAMILY(font)
      this.updateFontFamily()
    },
    updateVersion() {
      this.version = this.getVersion
    },
    updateTheme() {
      this.theme = this.getTheme
    },
    updateFontSize() {
      this.fontSize = this.getFontSize
    },
    updateFontFamily() {
      this.fontFamily = this.getFontFamily
    },
    exportSettings() {
      const data = {
        version: this.getStoreState.version,
        theme: this.getStoreState.theme,
        fontSize: this.getStoreState.fontSize,
        fontFamily: this.getStoreState.fontFamily,
        favoriteVerses: this.getStoreState.favoriteVerses
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
          this.SET_THEME(importedSettings.theme);
          this.SET_FONT_SIZE(importedSettings.fontSize);
          this.SET_FONT_FAMILY(importedSettings.fontFamily);
          this.FAVORITE_VERSES(importedSettings.favoriteVerses);
          this.updates()
          this.$toast.success("Preferências atualizadas");
        } catch (error) {
          this.$toast.error("Formato incompatível");
          console.error("Error parsing JSON:", error);
        }
      };
    },
    updates() {
      this.updateVersion()
      this.updateTheme()
      this.updateFontSize()
      this.updateFontFamily()
      this.UPDATE_FAVORITE_VERSES()
    },
    getDBSets() {
      this.versions = db.versions.map(version => ({ abbrev: version.abbrev, description: version.description }))
      this.themes = db.themes
      this.fontsFamily = db.fontsFamily
    }
  },
  computed: {
    ...mapGetters([
      'getVersion',
      'getTheme',
      'getFontSize',
      'getFontFamily'
    ]),
    getStoreState() {
      return this.$store.state
    },
    isFontSizeMin() {
      return this.getFontSize === this.$store.state.fontSizeMin
    },
    isFontSizeMax() {
      return this.getFontSize === this.$store.state.fontSizeMax
    }
  }
}
</script>

<style scoped>
.btn-font {
  @apply relative rounded-lg outline-none transition duration-100 w-10 h-8 bg-gray-200 dark:bg-gray-700 old:bg-brown-200 border border-gray-300 dark:border-gray-600 old:border-brown-300 select-none
}
.disabled-btn-font {
  @apply text-gray-400 dark:text-gray-500 old:text-brown-400
}
select {
  @apply px-1 py-3 outline-none select-none bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-50 old:bg-brown-50 old:text-brown-800 transition-all duration-100
}
</style>
