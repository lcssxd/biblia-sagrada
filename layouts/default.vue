<template>
  <div class="app" :style="{ fontFamily: getFontFamily, fontSize: `${getFontSize}px` }">
    <div class="body">
      <Transition name="fade" mode="out-in">
        <Nuxt class="mb-auto" :key="routePath" />
      </Transition>
      <InstallApp />
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import InstallApp from '~/components/InstallApp.vue';

export default {
  components: { InstallApp },
  created() {
    this.UPDATE_VERSION()
    this.UPDATE_THEME()
    this.UPDATE_FONT_SIZE()
    this.UPDATE_FONT_FAMILY()
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
    })
    this.SET_VERSION(this.getVersion)
    this.SET_THEME(this.getTheme)
    this.SET_FONT_SIZE(this.getFontSize)
    this.SET_FONT_FAMILY(this.getFontFamily)
    setTimeout(() => { this.$updateThemeColor(this.getTheme) }, 1)
  },
  computed: {
    ...mapGetters(['getVersion', 'getTheme', 'getFontSize', 'getFontFamily']),
    routePath() {
      return this.$route.path
    }
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'UPDATE_THEME', 'UPDATE_FONT_SIZE', 'UPDATE_FONT_FAMILY', 'SET_VERSION', 'SET_THEME', 'SET_FONT_SIZE', 'SET_FONT_FAMILY']),
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
  @apply flex justify-center h-full-screen min-w-80 bg-gray-50/75 dark:bg-gray-800/75 old:bg-brown-50/75
}

.body {
  @apply relative flex flex-col h-full w-full max-w-2xl bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-50 old:bg-brown-50 old:text-brown-800 transition-all duration-100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
