<template>
  <!--div class="app">
    <div class="bg-gray-900 text-gray-50 h-full min-w-min">
      <Nuxt />
    </div>
  </div-->
  <div>
    <Nuxt />
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
    @apply height-screen w-full min-w-[320px];
  }
</style>