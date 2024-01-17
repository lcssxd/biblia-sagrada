<template>
  <div class="flex flex-col h-full justify-between overflow-hidden">
    <Header class="relative flex items-center justify-center">
      <NuxtLink to="/settings" class="flex items-center absolute left-1 inset-y-0 p-2 cursor-pointer outline-none">
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