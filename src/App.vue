<template>
  <v-app>
    <AppBar
        ref="appBar"
        @mouseenter="fbDrawerModel = true"
        @mouseleave="fbDrawerModel = fbDrawerPermanent"
        @handleTickerClick="fbDrawerPermanent = !fbDrawerPermanent; fbDrawerModel = fbDrawerPermanent"
    />
    <FacebookDrawer ref="fbDrawer" :model="fbDrawerModel" :permanent="fbDrawerPermanent"/>
    <SnackBar v-for="(snack, index) in getSnacks" :key="index" :index="index" :snack="snack"/>
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
import FacebookDrawer from "@/components/drawers/FacebookDrawer";
export default {
  name: 'App',

  components: {
    AppBar,
    FacebookDrawer,
    SnackBar
  },

  data: () => ({
    fbDrawerHover: false,
    fbDrawerModel: false,
    fbDrawerPermanent: false,
  }),


  computed: {
    ...mapGetters('snack', ['getSnacks']),
  },
};
</script>
