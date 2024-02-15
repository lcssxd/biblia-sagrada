<template>
  <div class="app" :class="`${getFontFamily} ${getFontSize}`">
    <Nuxt class="mb-auto" />
    <Footer />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  created() {
    this.UPDATE_VERSION()
    this.UPDATE_THEMA()
    this.UPDATE_FONT_SIZE()
    this.UPDATE_FONT_FAMILY()
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
    })
    this.SET_VERSION(this.getVersion)
    this.SET_THEMA(this.getThema)
    this.SET_FONT_SIZE(this.getFontSize)
    this.SET_FONT_FAMILY(this.getFontFamily)
  },
  computed: {
    ...mapGetters(['getVersion', 'getThema', 'getFontSize', 'getFontFamily']),
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'UPDATE_THEMA', 'UPDATE_FONT_SIZE', 'UPDATE_FONT_FAMILY', 'SET_VERSION', 'SET_THEMA', 'SET_FONT_SIZE', 'SET_FONT_FAMILY']),
    getWindowHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }
}
</script>

<style>
  .h-full-screen {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }

  .app {
    @apply flex flex-col h-full-screen w-full justify-between min-w-[320px] bg-gray-50 text-gray-800 dark:text-gray-50 dark:bg-gray-800;
  }
</style>