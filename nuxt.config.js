export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Bíblia Sagrada',
    htmlAttrs: {
      lang: 'pt-BR'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/scrollbar.css',
    '@/assets/css/tailwind.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/toast.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/svg'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },

  // PWA Setup: https://pwa.nuxtjs.org/setup
  pwa: {
    manifest: {
      name: 'Biblia Sagrada',
      short_name: 'Biblia',
      description: 'Acesse a Bíblia Sagrada a qualquer momento, em qualquer lugar',
      lang: 'pt-BR',
      start_url: '/',
      display: 'standalone',
      background_color: '#1F2937',
      theme_color: '#1F2937',
      icons: [
        {
          src: 'static/favicon.ico',
          sizes: '512x512',
          type: 'image/x-icon',
          purpose: 'any maskable',
          background_color: '#1F2937',
        },
      ],
    },
    workbox: {
      offline: true,
      precaching: [
        '/',
        '/about',
        '/bible',
        '/favorite',
        '/search',
        '/settings',
      ],
      runtimeCaching: [
        {
          urlPattern: '^https://biblia-sagrada-vue.vercel.app/.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'apiCache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 24 * 60 * 60,
            },
          },
        },
      ],
    },
  },
}
