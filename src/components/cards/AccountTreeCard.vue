<template>
  <v-card class="mx-auto overflow-y-auto" max-height="400">
    <v-card-text class="mx-auto">
      <v-treeview
          dense
          selectable
          selected-color="primary"
          :items="items"
          :search="search"
          :open.sync="open"
          expand-icon="mdi-chevron-down"
          open-on-click
      >
        <template v-slot:prepend="{ item }">
          <v-icon v-text="`mdi-chess-${item.type === 'account' ? 'king' : 'queen'}`"/>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  namespaced: true,

  props: {
    search: String,
    items: Array,
  },

  data: () => ({
    open: [],
  }),
}
</script>
