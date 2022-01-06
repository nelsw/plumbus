<template>
  <div>
    <v-row>
      <v-col cols="12">
        <RulesCard :visible="getCard('Rule').visible"/>
        <FacebookCard/>
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
import FacebookCard from "@/components/cards/FacebookCard";
import {mapGetters} from "vuex";
import RulesCard from "@/components/cards/rule/RuleCard";

export default {
  namespaced: true,

  components: {RulesCard, FacebookCard},

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
