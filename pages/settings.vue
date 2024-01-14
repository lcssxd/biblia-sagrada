<template>
  <div>
    <div class="flex flex-col">
      <span class="p-2 text-center font-medium text-base select-none bg-gray-600 border-b border-gray-600">Versões</span>
      <button 
        v-for="(item, index) in versions" :key="index"
        class="relative p-2 outline-none select-none text-left border-b border-gray-600"
        @click.prevent="changeVersion(item.id)"
        >
        <span class="text-sm">{{ item.id }} - {{ item.title }}</span>
        <div v-if="version === item.id" class="absolute top-3 right-2 z-0">
          <checkIcon class="w-4 h-4" />
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import checkIcon from '@/static/heroicons/outline/check.svg?inline'
export default {
  components: { checkIcon },
  data() {
    return {
      versions: [
        {
          id: 'ARA',
          title: 'Almeida Revista e Atualizada - 1993',
        },
        {
          id: 'NTLH',
          title: 'Nova Tradução na Linguagem de Hoje - 1988',
        }
      ],
      version: null
    }
  },
  mounted() {
    this.updateVersion()
  },
  methods: {
    ...mapMutations(['SET_VERSION']),
    changeVersion(version) {
      this.SET_VERSION(version)
      this.updateVersion()
    },
    updateVersion() {
      this.version = this.getVersion
    }
  },
  computed: {
    ...mapGetters(['getVersion']),
  }
}
</script>

<style>

</style>
