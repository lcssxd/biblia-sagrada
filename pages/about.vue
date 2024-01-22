<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Header class="flex items-center space-x-2">
      <NuxtLink to="/settings" class="flex items-center p-2 cursor-pointer outline-none">
        <arrowlongleftIcon class="w-5 h-5" />
      </NuxtLink>
      <span>{{ title }}</span>
    </Header>
    <div>
      
    </div>
  </div>
</template>

<script>
import arrowlongleftIcon from '@/static/heroicons/mini/arrow-long-left.svg?inline'

export default {
  components: { arrowlongleftIcon },
  data() {
    return {
      title: 'Sobre'
    }
  }
}
</script>

<style>

</style>