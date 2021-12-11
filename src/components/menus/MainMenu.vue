<template>
  <v-menu v-if="getUser" offset-x open-on-hover :nudge-width="300" :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-avatar size="36">
          <v-img :src="$auth.user.picture"/>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar size="36">
            <v-img :src="$auth.user.picture"/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="getUser.name"/>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="setUser(null); toggleVisibility('user')">
              <v-icon v-text="`mdi-logout`"/>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider/>
        <v-list-item v-for="card in getDeck" :key="card.name" :card="card">
          <v-list-item-icon>
            <v-icon v-text="card.icon"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="card.name"/>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch :color="card.color" :input-value="card.visible" @change="toggleVisibility(card.name)"/>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>

import {mapActions, mapGetters} from "vuex"

export default {
  namespaced: true,

  components: {},

  computed: {
    ...mapGetters('user', ['getUser']),
    ...mapGetters('deck', ['getCard', 'getDeck']),
  },

  methods: {
    ...mapActions('user', ['setUser']),
    ...mapActions('deck', ['toggleVisibility']),
  },
}
</script>