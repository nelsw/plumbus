<template>
  <v-app>
    <AppBar/>
    <SnackBar
        v-for="(snack, index) in getSnacks"
        :key="index"
        :index="index"
        :snack="snack"
    />
    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";
import AppBar from "@/components/bars/AppBar";
import SnackBar from "@/components/bars/SnackBar";
export default {
  name: 'App',

  components: {
    SnackBar,
    AppBar

  },

  data: () => ({
    //
  }),


  computed: {
    ...mapGetters('snack', ['getSnacks']),
  },
};
</script>
