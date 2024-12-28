export default ({ store }, inject) => {
  const updateThemeColor = (theme) => {
    const colors = {
      light: '#f9fafb',
      dark: '#1f2937',
      old: '#f3e9e0',
    };

    const themeColor = colors[theme] || colors.light;

    // Atualiza a tag <meta name="theme-color">
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }

    // Atualiza o PWA manifest theme_color
    if (navigator.serviceWorker) {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        const url = new URL(manifestLink.href);
        url.searchParams.set('theme_color', themeColor);
        manifestLink.href = url.toString();
      }
    }
  };

  // Torna a função disponível globalmente
  inject('updateThemeColor', updateThemeColor);

  // Inicializa com o tema atual do store
  updateThemeColor(store.state.theme);

  // Observa mudanças no tema
  store.watch(
    (state) => state.theme,
    (newTheme) => {
      updateThemeColor(newTheme);
    }
  );
};
