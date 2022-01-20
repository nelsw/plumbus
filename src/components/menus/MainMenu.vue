<template>
  <v-menu offset-x open-on-hover :nudge-width="200" :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon v-text="`mdi-home-account`"/>
      </v-btn>
    </template>
    <v-card>
      <v-list>
<!--        <v-list-item>-->
<!--          <v-list-item-avatar size="36">-->
<!--            <v-img :src="$auth.user.picture"/>-->
<!--          </v-list-item-avatar>-->
<!--          <v-list-item-content>-->
<!--            <v-list-item-title v-text="getUser.name"/>-->
<!--          </v-list-item-content>-->
<!--          <v-list-item-action>-->
<!--            <v-btn icon @click="setUser(null); toggleVisibility('user')">-->
<!--              <v-icon v-text="`mdi-logout`"/>-->
<!--            </v-btn>-->
<!--          </v-list-item-action>-->
<!--        </v-list-item>-->
<!--        <v-divider/>-->
        <v-list-item v-for="card in getDeck" :key="card.name" :card="card">
          <v-list-item-icon>
            <v-icon v-text="card.icon"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="card.name"/>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch color="primary" :input-value="card.visible" @change="card.visible = !card.visible"/>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>

import {mapGetters} from "vuex"

export default {
  namespaced: true,

  computed: {
    ...mapGetters('deck', ['getCard', 'getDeck']),
  },
}
</script>