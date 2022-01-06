<template>
  <v-treeview
      dense
      selectable
      color="success"
      :items="items"
  />
</template>

<script>
import Snack from "@/models/Snack";
import {mapActions} from "vuex";

export default {
  namespaced: true,

  data: () => ({
    items: [],
  }),

  mounted() {
    this.fetchItems()
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
