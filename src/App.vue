<template>
  <v-app>
    <AppBar/>
    <SnackBar v-for="(snack, index) in getSnacks" :key="index" :index="index" :snack="snack"/>
    <v-main>
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" v-if="getCard('Manifest').visible">
            <ManifestCard :card="getCard('Manifest')"/>
          </v-col>
          <v-col cols="12" v-if="getCard('Rules').visible">
            <RulesCard :card="getCard('Rules')"/>
          </v-col>
          <v-col cols="12" v-if="getCard('Accounts').visible">
            <AccountCard :card="getCard('Accounts')" @open="open"/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <Fullscreen ref="fullscreen"/>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";
import AppBar from "@/components/bars/AppBar";
import SnackBar from "@/components/bars/SnackBar";
import ManifestCard from "@/components/cards/ManifestCard";
import RulesCard from "@/components/cards/rule/RuleCard";
import AccountCard from "@/components/cards/AccountCard";
import Fullscreen from "@/components/dialogs/Fullscreen";

export default {
  namespaced: true,

  components: {ManifestCard, Fullscreen, AppBar, SnackBar, RulesCard, AccountCard},

  computed: {
    ...mapGetters('deck', ['getCard']),
    ...mapGetters('snack', ['getSnacks']),
  },

  methods: {
    open(e) {
      this.$refs.fullscreen.open(e)
    },
  },
};
</script>
