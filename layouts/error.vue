<template>
  <div class="flex items-center justify-center size-full">
    <div class="text-center p-1">
      <h2 class="mb-8 font-extrabold text-9xl">
        <span class="sr-only">Erro</span>404
      </h2>
      <p class="text-2xl font-semibold md:text-3xl">Desculpe, não conseguimos encontrar esta página.</p>
      <p class="mt-4 mb-8">Mas não se preocupe, você pode encontrar muitas outras coisas na nossa página inicial.</p>
      <NuxtLink :to="{ name: 'index' }" class="px-8 py-3 font-semibold rounded bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100 old:bg-brown-200 old:text-brown-700">Voltar para a página inicial</NuxtLink>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
