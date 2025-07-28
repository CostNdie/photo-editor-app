import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,

  head: {
    titleTemplate: '%s - photo-editor-app',
    title: 'Photo Editor',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // CSS for toast ui image editor and color picker
  css: [
    'tui-image-editor/dist/tui-image-editor.css',
    'tui-color-picker/dist/tui-color-picker.css'
  ],

  plugins: [
    // Add your photo editor specific plugins here if needed
  ],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  auth: {
    redirect: {
      login: '/welcome',
      logout: '/welcome',
      callback: '/callback',
      home: '/home'
    },
    cookie: {
      options: {
        secure: true,
        domain: '.vercel.app'
      }
    },
    strategies: {
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        audience: '',
        redirectUri: process.env.AUTH0_REDIRECT_URI,
        logoutRedirectUri: process.env.AUTH0_LOGOUT_REDIRECT_URI,
        scope: ['openid', 'profile', 'email']
      }
    }
  },

  axios: {
    baseURL: '/'
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.lightBlue.accent3,
          accent: colors.grey.darken3,
          secondary: colors.grey.darken1,
          info: colors.cyan.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent3,
          success: colors.green.accent3
        }
      }
    }
  },

  build: {
    extend(config) {}
  },

  router: {
    middleware: [] // Optional: add ['auth'] if you want to protect all routes
  }
}
