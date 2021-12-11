<template>
  <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="time"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          class="text-field-transparent"
          :dense="small"
          :hint="hint"
          :persistent-hint="!!hint"
          :class="small ? 'caption' : ''"
          v-model="time"
          :label="label"
          readonly
          v-bind="attrs"
          v-on="on"
          :hide-details="!hint"
          :disabled="busy"
          :loading="busy"
      />
    </template>
    <v-time-picker
        v-if="menu"
        v-model="time"
        format="24hr"
        full-width
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
<style>
.text-field-transparent  .v-input__slot {
  background: transparent !important;
}
</style>