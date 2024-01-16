<template>
  <div class="app">
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
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
    })
    this.SET_VERSION(this.getVersion)
    this.SET_THEMA(this.getThema)
  },
  computed: {
    ...mapGetters(['getVersion', 'getThema']),
  },
  methods: {
    ...mapMutations(['UPDATE_VERSION', 'UPDATE_THEMA', 'SET_VERSION', 'SET_THEMA']),
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