<template>
  <v-card v-if="visible" raised rounded elevation="24" class="mb-3">
    <v-toolbar rounded>
      <TooltipButton icon="mdi-cards" tooltip="Rules" @click="fetchItems"/>
      <v-toolbar-title>
        <span v-text="`Rules`"/>
      </v-toolbar-title>
      <v-spacer/>
      <TooltipButton icon="mdi-plus" tooltip="New Rule"/>
    </v-toolbar>
    <v-data-table
        dense
        show-expand
        single-expand
        item-key="id"
        :items="items"
        :expanded="expanded"
        :loading="loading"
        :headers="[
          {text: 'ID',  value: 'id', width: 350, sortable: false},
          {text: 'Name', value: 'name', sortable: false},
          {text: 'Action', value: 'action', sortable: false},
          {text: 'Created', value: 'created', width: 250, sortable: false},
          {text: 'Updated', value: 'updated', width: 250, sortable: false},
          {text: '', value: '', width: 0, divider: true, sortable: false},
          {text: '', value: 'data-table-expand', align: 'center'}
        ]"
    >
      <template v-slot:item.status="{ item }">
        {{ statusText(item) }}
      </template>
      <template v-slot:item.created="{ item }">
        {{ formatDatetime(item.created) }}
      </template>
      <template v-slot:item.updated="{ item }">
        {{ formatDatetime(item.updated) }}
      </template>
      <template v-slot:item.data-table-expand="{isSelected, item, expand, isExpanded}">
        <div class="d-flex flex flex-row align-center">

          <TooltipButton v-if="item.status" small color="warning" icon="mdi-pause" tooltip="Pause Rule"/>
          <TooltipButton v-else  small color="success" icon="mdi-play" tooltip="Activate Rule"/>
          <TooltipButton small color="primary" icon="mdi-pencil" tooltip="Edit Rule" @click="editRule(item)"/>
          <TooltipButton small color="error" icon="mdi-delete" tooltip="Delete Rule" @click="deleteRule(item)"/>
          <ExpandButton
              :tooltip="`${isExpanded ? 'Collapse' : 'Expand'} Rule`"
              :expand="expand"
              :is-expanded="isExpanded"
          />
        </div>
      </template>
      <template v-slot:expanded-item="{ headers, item }">

        <td :colspan="headers.length" class="pa-2">

          <v-toolbar dense rounded>
            <TooltipButton icon="mdi-cards-outline" tooltip="Rules" @click="fetchItems"/>
            <v-toolbar-title>
              <span v-text="`Conditions`"/>
            </v-toolbar-title>
            <v-spacer/>
            <TooltipButton icon="mdi-plus" tooltip="New Rule"/>
          </v-toolbar>
            <v-data-table
                dense
                hide-default-footer
                :items-per-page="-1"
                :items="item.conditions"
                :headers="[
                  {text: 'ID',  value: 'id', width: 350, sortable: false},
                  // {text: '', value: '', align: 'center'},
                  {text: 'Order',  value: 'order', width: 100},
                  {text: 'Key',  value: 'key', width: 100, sortable: false},
                  {text: 'Operator', value: 'operator', width: 100, align: 'center', sortable: false},
                  {text: 'Value', value: 'value', width: 100, sortable: false},
                  {text: '', value: '', align: 'center', sortable: false},
                  {text: 'Created', value: 'created', width: 250, sortable: false},
                  {text: 'Updated', value: 'updated', width: 250, sortable: false},
                  {text: '', value: '', width: 0, divider: true, sortable: false},
                  {text: '', value: 'actions', align: 'center'}
                ]"
            >
              <template v-slot:item.key="{ item }">
                {{ keyText(item) }}
              </template>
              <template v-slot:item.operator="{ item }">
                {{ operatorText(item) }}
              </template>
              <template v-slot:item.value="{ item }">
                {{ valueText(item) }}
              </template>
              <template v-slot:item.actions="{item}">
                <div class="d-flex flex flex-row align-center">
                  <TooltipButton small color="error" icon="mdi-delete" tooltip="Delete Rule" @click="deleteRule(item)"/>
                </div>
              </template>
        </v-data-table>
        </td>
      </template>
    </v-data-table>
    <RuleDialog ref="ruleDialog" @refresh="fetchItems" />
  </v-card>
</template>

<script>
import Snack from "@/models/Snack";
import TooltipButton from "@/components/buttons/TooltipButton";
import ExpandButton from "@/components/buttons/ExpandButton";
import moment from "moment";
import RuleDialog from "@/components/dialogs/RuleDialog";
import {mapActions} from "vuex";

export default {
  components: {RuleDialog, ExpandButton, TooltipButton},
  namespaced: true,

  props: {
    visible: Boolean,
  },

  data: () => ({
    loading: true,
    items: [],
    expanded: [],
  }),

  mounted() {
    this.fetchItems()
  },

  methods: {
    ...mapActions('snack', ['add']),

    formatDatetime(datetime) {
      return moment(datetime).format('ddd, DD MMM YYYY, HH:mm:ss z') + ' UTC'
    },

    editRule(item) {
      this.$refs.ruleDialog.load(item)
    },

    deleteRule(item) {
      this.loading = true
      this.$http
          .delete(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/rule?id=${item.id}`)
          .then(() => this.fetchItems())
          .catch(error => this.add(Snack.Err(error)))
    },

    enableRule(item) {
      item.enabled = true
      this.updateItem(item)
    },

    disableRule(item) {
      item.enabled = false
      this.updateItem(item)
    },

    updateItem(item) {
      console.log(item)
    },

    statusText(item) {
      return item.status ? 'Active' : 'Paused'
    },

    keyText(item) {
      let s = item.key.toLowerCase()
      let a = s.charAt(0).toUpperCase()
      let z = s.slice(1)
      return a + z
    },

    operatorText(item) {
      return item.operator === 'gt' ? '>' : '<'
    },

    valueText(item) {
      return this.$formatPrice(item.value)
    },

    fetchItems() {
      this.loading = true
      this.items = []
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/rule`)
          .then(result => this.items = result.data)
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.loading = false)
    },
  },



}
</script>