<template>
  <v-card v-if="card.visible" raised rounded elevation="24" class="mb-3" :disabled="busy">
    <v-toolbar rounded>
      <v-icon v-text="card.icon" class="mr-3"/>
      <v-toolbar-title>
        <span v-text="card.name"/>
        <span v-text="card.subtitle" class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down"/>
      </v-toolbar-title>
      <v-spacer/>
      <TooltipButton icon="mdi-refresh" tooltip="Refresh Accounts" @click="refreshItems"/>
      <ExpandButton :domain="card.name" :expand="() => {card.expanded = !card.expanded}" :is-expanded="card.expanded"/>
      <TooltipButton icon="mdi-close" tooltip="Close" @click="card.visible = false"/>
    </v-toolbar>
    <v-expand-transition>
      <v-data-table
          v-if="card.expanded"
          dense
          item-key="id"
          :items="items"
          page-text="Rows"
          :loading="loading"
          :headers="[
            {text: 'Name', value: 'name', sortable: true},
            {text: 'Status', value: 'status', width: 0, sortable: false},
            {text: 'Created', value: 'created_time', width: 100, sortable: true},
            {text: '', value: '', width: 0, divider: true, sortable: false},
            {text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
          ]"
      >
        <template v-slot:item.created_time="{ item }">
          {{ $moment(item.created_time).format("MM/DD/YY") }}
        </template>
        <template v-slot:item.data-table-expand="{isSelected, item}">
          <div class="d-flex flex flex-row align-center">
            <TooltipButton
                small
                :color="item.included ? 'blue-grey' : 'light-green accent-3'"
                :icon="`mdi-toggle-switch${item.included ? '' : '-off'}-outline`"
                :tooltip="`${item.included ? 'Ex' : 'In'}clude Account`"
                @click="toggleInclusion(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-expand-transition>
  </v-card>
</template>

<script>
import TooltipButton from "@/components/buttons/TooltipButton";
import Snack from "@/models/Snack";
import {mapActions} from "vuex";
import Card from "@/models/Card";
import ExpandButton from "@/components/buttons/ExpandButton";

export default {
  namespaced: true,
  components: {ExpandButton, TooltipButton},

  props: {
    card: Card,
  },

  data: () => ({
    busy: false,
    show: true,
    loading: true,
    items: [],
    expanded: [],
  }),

  mounted() {
    this.fetchItems()
  },

  methods: {
    ...mapActions('snack', ['add']),

    toggleInclusion(item) {
      this.busy = true
      this.$http
          .patch(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/account?id=${item.account_id}`)
          .then(() => this.add(Snack.OK(`Account ${item.included ? 'Ex' : 'In'}cluded`)))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    fetchItems() {
      this.loading = true
      this.items = []
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/account?pos=all`)
          .then(result => this.items = result.data)
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.loading = false)
    },

    refreshItems() {
      this.loading = true
      this.items = []
      this.$http
          .put(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/account`)
          .then(result => this.items = result.data)
          .then(() => this.add(Snack.OK('Manifest Refreshed')))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.loading = false)
    },
  },

}
</script>
<style>
div.col-12:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > i:nth-child(1) {
  display: none;
}
</style>