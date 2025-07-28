<template>
  <v-container fluid>
    <client-only><ModernImageEditor /></client-only>
  </v-container>
</template>

<script>
import ModernImageEditor from '@/components/ModernImageEditor.vue'
export default { components: { ModernImageEditor } }
</script>
