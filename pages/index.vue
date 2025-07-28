<script>
export default {
  middleware: 'auth',
  mounted() {
    this.$router.replace('/home') // ✅ Redirect to your home.vue
  }
}
</script>

<template>
  <div>
    Redirecting to home...
  </div>
</template>