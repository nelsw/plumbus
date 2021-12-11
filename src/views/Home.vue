<template>
  <div class="d-flex flex-column align-center justify-center">
    <v-card rounded class="mb-15" elevation="24">
      <v-row class="text-center mt-10">
        <v-col cols="12">
          <v-img :src="require('@/assets/logo.png')" class="my-3" contain height="200"/>
        </v-col>
        <v-col class="mb-4">
          <h1 class="display-2 font-weight-bold mb-5" v-text="`Welcome to plumbus`"/>
          <p class="subheading" v-text="`If you have to ask, you'll never know.`"/>
          <a href="https://www.alittlebithuman.com/what-is-a-plumbus/" target="_blank" v-text="`For the plebs ...`"/>
        </v-col>
      </v-row>
    </v-card>
    <div v-if="!$auth.loading">
      <!-- show login when not authenticated -->
      <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>
      <!-- show logout when authenticated -->
      <button v-if="$auth.isAuthenticated" @click="logout">Log out</button>
    </div>
  </div>
</template>

<script>
export default {
  namespaced: true,
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
