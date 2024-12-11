<template>
  <div class="header">
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.header {
  @apply font-semibold p-3 w-full select-none shadow z-10 rounded-b-lg bg-gray-300 dark:bg-gray-700 old:bg-brown-300
}
</style>
