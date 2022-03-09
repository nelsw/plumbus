<template>
  <v-menu offset-x :nudge-width="150" :close-on-content-click="false" open-on-click>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <TooltipButton icon="mdi-view-column" tooltip="Column Visibility"/>
      </div>
    </template>
    <v-card>
      <v-list>
        <div v-for="(c, index) in columns" :key="index">
        <v-list-item dense v-if="c.text !== ''">
            <v-list-item-content>
              <v-list-item-title v-text="c.text"/>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch dense color="primary" :input-value="c.visible" @change="c.visible = !c.visible"/>
            </v-list-item-action>
        </v-list-item>
          </div>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>

import TooltipButton from "@/components/buttons/TooltipButton";

export default {
  components: {TooltipButton},
  namespaced: true,

  props: {
    columns: Array,
  },
}
</script>