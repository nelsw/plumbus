<template>
  <v-app>
    <AppBar/>
    <SnackBar v-for="(snack, index) in getSnacks" :key="index" :index="index" :snack="snack"/>
    <v-main>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <IgnoredCard :card="getCard('Manifest')"/>
          </v-col>
          <v-col cols="12">
            <RulesCard :card="getCard('Rules')"/>
          </v-col>
          <v-col cols="12">
            <AccountCard :card="getCard('Portfolio')"/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";
import AppBar from "@/components/bars/AppBar";
import SnackBar from "@/components/bars/SnackBar";
import IgnoredCard from "@/components/cards/ManifestCard";
import RulesCard from "@/components/cards/rule/RuleCard";
import AccountCard from "@/components/cards/AccountCard";

export default {
  namespaced: true,

  components: {
    AppBar,
    SnackBar,
    IgnoredCard, RulesCard, AccountCard
  },

  computed: {
    ...mapGetters('deck', ['getCard']),
    ...mapGetters('snack', ['getSnacks']),
  },
};
</script>
