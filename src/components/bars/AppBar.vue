<template>
  <v-app-bar app>
    <v-row no-gutters class="d-flex flex justify-start align-center">
      <v-col class="d-flex">
        <Logo/>
      </v-col>
      <v-col class="d-flex justify-center align-center">
        <div class="text-subtitle-2" v-text="timestamp" @click="switchChoice"/>
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
// import moment from "moment";
import moment_tz from "moment-timezone";
import Logo from "@/components/arts/Logo";
import MainMenu from "@/components/menus/MainMenu";

export default {
  namespaced: true,
  components: {MainMenu, Logo},

  data: () => ({
    timestamp: null,
    tz: null,
    choice: 0,
    choices: ['UTC', 'America/Los_Angeles', 'America/New_York'],
  }),

  mounted() {
    // this.tz = moment.tz.guess()
    this.tz = this.choices[0]
    this.updateTimestamp()
  },

  methods: {
    updateTimestamp() {
      this.timestamp = moment_tz().tz(this.tz).format('ddd, DD MMM YYYY, HH:mm:ss z')
      setTimeout(() => this.updateTimestamp(), 1000);
    },

    switchChoice() {
      let i = this.choices.indexOf(this.tz)
      if (i === this.choices.length - 1) {
        i = 0
      } else {
        ++i
      }
      this.tz = this.choices[i]
    },
  },
}
</script>