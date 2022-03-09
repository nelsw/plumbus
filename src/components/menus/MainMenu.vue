<template>
  <v-menu offset-x :nudge-width="200" :close-on-content-click="false" open-on-click>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <TooltipButton icon="mdi-home-account" bottom tooltip="Menu" />
      </div>
    </template>
    <v-card>
      <v-list>
        <v-list-item v-for="card in getDeck" :key="card.name" :card="card">
          <v-list-item-icon>
            <v-icon v-text="card.icon"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="card.name"/>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch color="primary" :input-value="card.visible" @change="change(card)"/>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>

import {mapGetters} from "vuex"
import TooltipButton from "@/components/buttons/TooltipButton";

export default {
  components: {TooltipButton},
  namespaced: true,

  computed: {
    ...mapGetters('deck', ['getCard', 'getDeck']),
  },

  methods: {
    change(card) {
      card.visible = !card.visible
      if (card.visible) card.expanded = true
    }
  },
}
</script>