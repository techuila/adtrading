<template>
  <v-snackbar
    v-model="snackbar.show"
    :bottom="true"
    :timeout="6000"
    :color="snackbar.type"
  >
    {{ snackbar.text }}
    <v-icon
      id="snackbar-close"
      size="16"
      @click="snackbar.show = false"
    >
      mdi-close-circle
    </v-icon>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('app', ['snackbar'])
  }
}
</script>

<style scoped>
#snackbar-close {
  color: rgba(255, 255, 255, 0.5);
}

#snackbar-close:hover {
  color: rgba(255, 255, 255, 0.3);
}
</style>
