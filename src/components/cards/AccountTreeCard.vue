<template>
  <v-card class="mx-auto overflow-y-auto" max-width="500" max-height="400">
    <v-sheet class="pa-4">
      <v-text-field
          v-model="search"
          label="Filter Accounts"
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
      />
    </v-sheet>
    <v-card-text class="mx-auto">
      <v-treeview
          dense
          selectable
          selected-color="primary"
          :items="items"
          :search="search"
          :filter="filter"
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
import {mapActions} from "vuex";
import Snack from "@/models/Snack";

export default {
  namespaced: true,

  mounted() {
    this.fetchItems()
  },

  data: () => ({
    items: [],
    open: [],
    search: null,
  }),

  computed: {
    filter () {
      return (item, search, textKey) => item[textKey].indexOf(search) > -1
    },
  },

  methods: {
    ...mapActions('snack', ['add']),

    fetchItems() {
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/tree`)
          .then(result => {
            this.items = result.data
            this.$debug(this.items)
          })
          .catch(error => this.add(Snack.Err(error)))
    }
  },
}
</script>
