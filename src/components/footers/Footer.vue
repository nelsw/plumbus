<template>
  <v-footer app>
    <div class="d-flex flex flex-row-reverse caption" v-text="timestamp" @click="utc = !utc"/>
  </v-footer>
</template>

<script>
import moment from "moment";
import moment_tz from "moment-timezone";

export default {
  namespaced: true,

  data: () => ({
    timestamp: null,
    utc: true,
  }),

  mounted() {
    this.updateTimestamp()
  },

  methods: {
    updateTimestamp() {
      this.timestamp
          = this.utc
          ? moment().utc().format("ddd, DD MMM YYYY, HH:mm:ss z")
          : moment_tz().tz('America/Los_Angeles').format('ddd, DD MMM YYYY, HH:mm:ss z')
      setTimeout(() => this.updateTimestamp(), 1000);
    },
  },
}
</script>