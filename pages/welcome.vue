<template>
  <v-container
    class="fill-height d-flex justify-center align-center text-center welcome-bg"
  >
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-10 rounded-xl" elevation="12" color="#1a1a1a">
          <h1 class="text-h4 font-weight-bold mb-4 light-blue--text text--accent-2">
            🎨 Photo Editor
          </h1>
          <p class="mb-6 grey--text text--lighten-1">
            Enhance and personalize your images with powerful editing tools, right from your browser.
          </p>
          <v-btn color="light-blue darken-3" large dark @click="login">
            Continue
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    login() {
      this.$auth.loginWith('auth0')
    }
  }
}
</script>

<style scoped>
.welcome-bg {
  background: linear-gradient(135deg, #0d0d0d, #1a1a1a);
}

h1, p {
  text-align: center;
}
</style>
