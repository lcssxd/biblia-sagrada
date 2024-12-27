<template>
  <div class="fixed bottom-14 left-1/2 -translate-x-1/2">
    <button
      id="install-button"
      style="display: none;"
      @click="installApp"
      class="items-center space-x-2 button bg-gray-300 dark:bg-gray-700 old:bg-brown-300 px-2 py-1 rounded-xl"
    ><InstallIcon class="size-6" /><span>Instalar App</span></button>
  </div>
</template>

<script>
import InstallIcon from '@/static/svgrepo/install.svg?inline'

export default {
  components: { InstallIcon },
  data() {
    return {
      deferredPrompt: null
    };
  },
  mounted() {
    this.checkIfInstalled();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installButton = document.getElementById('install-button');
      if (installButton) {
        installButton.style.display = 'flex';
      }
    });
  },
  methods: {
    checkIfInstalled() {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        const installButton = document.getElementById('install-button');
        if (installButton) {
          installButton.style.display = 'none';
        }
      } else {
        const installButton = document.getElementById('install-button');
        if (installButton) {
          installButton.style.display = 'flex';
        }
      }
    },
    installApp() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Usuário aceitou a instalação');
            const installButton = document.getElementById('install-button');
            if (installButton) {
              installButton.style.display = 'none';
            }
          } else {
            console.log('Usuário recusou a instalação');
          }
          this.deferredPrompt = null;
        });
      }
    },
  },
};
</script>
