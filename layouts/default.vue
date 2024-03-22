<template>
  <div class="app" :style="{ fontFamily: getFontFamily, fontSize: getFontSize + 'px' }">
    <Transition name="fade" mode="out-in">
      <Nuxt class="mb-auto" :key="routePath" />
    </Transition>
    <Footer />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
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
  @apply flex flex-col h-full-screen w-full justify-between min-w-[320px] bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-50 old:bg-brown-400 old:text-brown-900 transition-all;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>