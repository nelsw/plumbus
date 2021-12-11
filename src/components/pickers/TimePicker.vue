<template>
  <v-menu
      v-model="menu"
      offset-y
      ref="menu"
      max-width="290px"
      min-width="290px"
      transition="scale-transition"
      :return-value.sync="time"
      :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          v-on="on"
          v-bind="attrs"
          v-model="time"
          readonly
          :hint="hint"
          :label="label"
          :loading="busy"
          :disabled="busy"
          :hide-details="!hint"
          :persistent-hint="!!hint"
      />
    </template>
    <v-time-picker
        v-if="menu"
        v-model="time"
        full-width
        format="24hr"
        @click:minute="$refs.menu.save(time)"
    />
  </v-menu>
</template>

<script>
export default {
  namespaced: true,

  props: {
    busy: Boolean,
    label: String,
    small: Boolean,
    hint: String,
  },

  data: () => ({

    // boring menu visibility flag
    menu: false,

    // a pretty formatted version of the "time"
    time: null,

    // hours + sounds in milliseconds
    milli: 0,

    seconds: 0,
  }),

  created() {
    this.time = this.$moment().utc().format('HH:mm')
  },

  watch: {
    time() {
      let chunks = this.time.split(":")
      let hours = Number(chunks[0])
      let minutes = Number(chunks[1])
      if (hours > 0) {
        minutes += (hours * 60)
      }
      this.seconds = minutes * 60
      this.milli = this.seconds * 1000
    },
  },
}
</script>