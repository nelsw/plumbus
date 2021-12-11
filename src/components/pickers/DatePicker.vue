<template>
  <v-menu
      class="text-field-transparent"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          class="caption"
          dense
          v-model="date"
          hide-details
          :prefix="label"
          readonly
          v-bind="attrs"
          v-on="on"
          :disabled="busy"
          :loading="busy"
      />
    </template>
    <v-date-picker
        v-model="model"
        no-title
        @input="menu = false"
    />
  </v-menu>

</template>

<script>
export default {
  namespaced: true,

  props: {
    alpha: Boolean,
    busy: Boolean,
    label: String,
  },

  data: () => ({

    // boring menu visibility flag
    menu: false,

    // a moment object
    instant: null,

    // an ISO String of the instant
    model: null,

    // a pretty formatted version of instant
    date: null,

    // unix milliseconds of the instant
    milli: 0,

    seconds: 0,
  }),

  created() {
    let m = this.$moment().utc()
    this.instant = this.alpha ? m.subtract(1, 'day') : m
  },

  watch: {
    instant() {
      this.date = this.instant.utc().format('MM/DD/YY')
      this.model = this.instant.utc().toISOString()
      this.milli = this.instant.utc().startOf('day').valueOf()
      this.seconds = this.instant.utc().startOf('day').unix()
    },
    model() {
      this.instant = this.$moment(this.model)
    },
  },
}
</script>
<style>
.text-field-transparent  .v-input__slot {
  background: transparent !important;
}
</style>