<template>
  <!--div class="app">
    <div class="bg-gray-900 text-gray-50 h-full min-w-min">
      <Nuxt />
    </div>
  </div-->
  <div class="app">
    <Nuxt class="mb-auto" />
    <Footer />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
    })
  },
  methods: {
    getWindowHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }
}
</script>

<style>
  .height-screen {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }

  .app {
    @apply flex flex-col height-screen w-full justify-between min-w-[320px] text-gray-50 bg-gray-800;
  }
</style>