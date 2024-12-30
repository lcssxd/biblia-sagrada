<template>
  <div
    v-if="getInstallAppButton && showBanner"
    class="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-[99%] z-50"
  >
    <div class="px-6 py-4 bg-gray-300 dark:bg-gray-700 old:bg-brown-300 shadow-lg rounded-lg">
      <div class="flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-3">
          <InstallIcon class="size-6 min-w-6 min-h-6 text-gray-800 dark:text-gray-50 old:text-brown-800" />
          <p class="text-color">
            Deseja instalar o aplicativo <strong>Sagrada Escritura</strong>?
          </p>
        </div>
        <div class="flex space-x-3">
          <button
            @click.prevent="installApp"
            class="px-4 py-2 font-medium bg-gray-100 dark:bg-gray-50 old:bg-brown-700 old:text-gray-50 dark:text-gray-700 rounded-lg"
          >Sim</button>
          <button
            @click.prevent="closeBanner"
            class="px-4 py-2 font-medium border border-gray-700 dark:border-gray-50 old:border-brown-700 dark:hover:bg-gray-600 rounded-lg"
          >Não</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InstallIcon from '@/static/svgrepo/install.svg?inline'

export default {
  components: { InstallIcon },
  data() {
    return {
      deferredPrompt: null,
      showBanner: false
    };
  },
  mounted() {
    this.checkIfInstalled();

    this.beforeInstallHandler = (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showBanner = true;
    };
    window.addEventListener('beforeinstallprompt', this.beforeInstallHandler);
  },
  beforeDestroy() {
    window.removeEventListener('beforeinstallprompt', this.beforeInstallHandler);
  },
  computed: {
    getInstallAppButton() {
      return this.$store.state.installAppButton;
    },
    deviceType() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/android/i.test(userAgent)) {
        return { type: "android" };
      }
      if (
        /iPad|iPhone|iPod/.test(userAgent) &&
        !window.MSStream &&
        !/Windows/i.test(userAgent) &&
        navigator.platform !== "Win32"
      ) {
        return { type: "ios" };
      }
      return { type: "desktop" };
    }
  },
  methods: {
    checkIfInstalled() {
      if (this.deviceType.type === "desktop") {
        this.showBanner = !window.matchMedia('(display-mode: standalone)').matches;
      }
    },
    installApp() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.showBanner = false;
          }
          this.deferredPrompt = null;
        });
      }
    },
    closeBanner() {
      this.$store.commit("SET_INSTALL_BUTTON", false);
    }
  },
};
</script>
