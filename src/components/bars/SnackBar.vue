<template>
  <v-snackbar
      v-model="model"
      :color="snack.level"
      :value="model"
      :style="style"
      :elevation="24"
      :timeout="timeout"
      outlined
      top
      right
      transition="slide-x-reverse-transition"
  >
    {{ snack.text }}

    <template v-slot:action="{ attrs }">
      <v-btn
          text
          v-bind="attrs"
          @click="close()"
          v-text="`Close`"
      />
    </template>
  </v-snackbar>
</template>

<script>
import {mapActions} from "vuex";

export default {
  namespaced: true,

  props: {
    index: Number,
    snack: Object,
  },

  data: () => ({
    model: true,
    timeout: 10_000,
  }),

  mounted() {
    setTimeout(() => this.close(), this.timeout)
  },

  computed: {
    style() {
      if (this.index === 0) {
        return ``
      }
      return `margin-top:${((this.index) * 58)}px;`
    }
  },

  methods: {
    ...mapActions('inbox', ['delSnack']),
    close() {
      this.model = false
      this.delSnack(this.snack)
    },
  },
}
</script>
