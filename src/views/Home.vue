<template>
  <div>
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
    <!--  <div class="d-flex flex-column align-center justify-center">-->
    <!--    <div v-if="!$auth.loading">-->
    <!--       show login when not authenticated -->
    <!--      <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>-->
    <!--       show logout when authenticated -->
    <!--      <button v-if="$auth.isAuthenticated" @click="logout">Log out</button>-->
    <!--    </div>-->
    <!--  </div>-->
  </div>
</template>

<script>
import AccountCard from "@/components/cards/AccountCard";
import {mapGetters} from "vuex";
import RulesCard from "@/components/cards/rule/RuleCard";
import IgnoredCard from "@/components/cards/ManifestCard";

export default {
  namespaced: true,

  components: {IgnoredCard, RulesCard, AccountCard},

  computed: {
    ...mapGetters('deck', ['getCard']),
  },

  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
      this.$router.push('Dash')
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>
