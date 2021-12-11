<template>
  <v-app-bar app dense clipped-left>
    <v-row no-gutters class="d-flex flex align-center">
    <v-col class="d-flex">
      <v-img max-width="48px" :src="require(`@/assets/logo.png`)" @click="$emit('handleClick')"/>
    </v-col>
    <v-col class="d-flex justify-center align-center">
      <div v-text="timestamp" @click="utc = !utc"/>
    </v-col>
    <v-col >
      <div class="d-flex justify-end align-center flex-shrink-1">
        <MainMenu/>
      </div>
    </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import moment from "moment";
import MainMenu from "@/components/menus/MainMenu";

export default {
  namespaced: true,
  components: {MainMenu},

  data: () => ({
    tickerClicked: false,
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
          : moment().format("ddd, DD MMM YYYY, hh:mm:ss a")
      setTimeout(() => this.updateTimestamp(), 1000);
    },
  },
}
</script>