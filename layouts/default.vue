<template>
  <v-app dark>
    <!-- App Bar -->
    <v-app-bar app dense color="black" dark elevate-on-scroll>
      <v-spacer />

      <!-- Centered Title -->
      <v-toolbar-title class="text-center font-weight-bold light-blue--text text--accent-2">
        🖼️ Photo Editor
      </v-toolbar-title>

      <v-spacer />

      <!-- Burger Icon for Home Page Only -->
      <v-app-bar-nav-icon
        v-if="$auth.loggedIn && $route.path === '/home'"
        @click.stop="drawer = !drawer"
        color="light-blue accent-2"
      />
    </v-app-bar>

    <!-- Right Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      right
      temporary
      color="#1c1c1c"
    >
      <v-list dense>
        <v-list-item @click="logout" class="logout-item">
          <v-list-item-action>
            <v-icon color="light-blue accent-2">mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-title class="white--text font-weight-medium">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Page Content -->
    <v-main class="main-bg">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: false
    }
  },
  methods: {
    logout() {
      this.drawer = false
      this.$auth.logout({
        returnTo: process.env.AUTH0_LOGOUT_REDIRECT_URI
      })
    }
  }
}
</script>

<style scoped>
.main-bg {
  background-color: #121212;
  min-height: 100vh;
  padding-bottom: 40px;
}

.logout-item {
  transition: background 0.2s;
}

.logout-item:hover {
  background-color: rgba(33, 150, 243, 0.1); /* Light blue hover effect */
}
</style>
