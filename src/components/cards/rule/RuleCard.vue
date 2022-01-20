<template>
  <v-card v-if="card.visible" raised rounded elevation="24" class="mb-3" :loading="busy" :disabled="busy">
    <v-toolbar rounded>
      <v-icon v-text="card.icon" class="mr-3"/>
      <v-toolbar-title>
        <span v-text="card.name"/>
        <span v-text="card.subtitle" class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down"/>
      </v-toolbar-title>
      <v-spacer/>
      <TooltipButton icon="mdi-plus" tooltip="New Rule" @click="$refs.ruleDialog.load()"/>
      <ExpandButton :domain="card.name" :expand="() => {card.expanded = !card.expanded}" :is-expanded="card.expanded"/>
      <TooltipButton icon="mdi-close" tooltip="Close" @click="card.visible = false"/>
    </v-toolbar>
    <v-expand-transition>
      <v-data-table
          v-if="card.expanded"
          dense
          item-key="id"
          :items="items"
          :loading="loading"
          :headers="[
            {text: 'ID',  value: 'id', width: 350, sortable: false},
            {text: 'Name', value: 'name', sortable: false},
            {text: 'Condition', value: 'condition', sortable: false},
            {text: 'Result', value: 'action', sortable: false},
            {text: 'Updated', value: 'updated', width: 0, sortable: false},
            {text: 'Created', value: 'created', width: 0, sortable: false},
            {text: '', value: '', width: 0, divider: true, sortable: false},
            {text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
          ]"
      >
        <template v-slot:item.action="{ item }">
          {{ (item.effect === 'PAUSED' ? 'Disable' : 'Enable') + ' Campaigns' }}
        </template>
        <template v-slot:item.condition="{ item }">
          {{ conditionText(item) }}
        </template>
        <template v-slot:item.created="{ item }">
          {{ formatDatetime(item.created) }}
        </template>
        <template v-slot:item.updated="{ item }">
          {{ formatDatetime(item.updated) }}
        </template>
        <template v-slot:item.data-table-expand="{isSelected, item}">
          <div class="d-flex flex flex-row align-center">
            <TooltipButton
                small
                color="success"
                icon="mdi-arrow-up"
                tooltip="Run Rule"
                @click="run(item)"
            />
            <TooltipButton
                v-if="item.status"
                small
                color="warning"
                icon="mdi-pause"
                tooltip="Pause Rule"
                @click="item.status = false; save(item)"
            />
            <TooltipButton
                v-else
                small
                color="success"
                icon="mdi-play"
                tooltip="Activate Rule"
                @click="item.status = true; save(item)"
            />
            <TooltipButton
                small
                color="primary"
                icon="mdi-pencil"
                tooltip="Edit Rule"
                @click="$refs.ruleDialog.load(item)"
            />
            <TooltipButton
                small
                color="error"
                icon="mdi-delete"
                tooltip="Delete Rule"
                @click="$refs.deleteDialog.load(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-expand-transition>
    <RuleDialog ref="ruleDialog" @refresh="fetchItems" @save="save($event)"/>
    <BiDialog ref="deleteDialog" :title="`Delete Rule?`" text="This action is permanent ..." @yes="del($event)"/>
  </v-card>
</template>

<script>
import Snack from "@/models/Snack";
import TooltipButton from "@/components/buttons/TooltipButton";
import moment from "moment";
import RuleDialog from "@/components/dialogs/RuleDialog";
import {mapActions} from "vuex";
import BiDialog from "@/components/dialogs/BiDialog";
import ExpandButton from "@/components/buttons/ExpandButton";
import Card from "@/models/Card";

export default {
  namespaced: true,
  components: {ExpandButton, BiDialog, RuleDialog, TooltipButton},

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

    formatDatetime(datetime) {
      return moment(datetime).format('MM/DD/YY')
    },

    conditionText(item) {

      let text = ''

      item.conditions.forEach(condition => {
        let parts = []
        if (text === '') {
          parts.push('if ')
        } else {
          parts.push(' and ')
        }
        parts.push('(')
        parts.push(condition.lhs)
        parts.push(' ')
        parts.push(condition.op)
        parts.push(' ')
        if (condition.lhs !== "ROI") {
          parts.push('$')
        }
        parts.push(condition.rhs.toString())
        if (condition.lhs === "ROI") {
          parts.push('%')
        }
        parts.push(')')
        text += parts.join('')
      })

      return text
    },

    run(item) {
      this.busy = true
      this.$http
          .post(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/rule`, item)
          .then(() => this.add(Snack.OK('Rule Running!')))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    del(item) {
      this.busy = true
      this.$http
          .delete(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/rule?id=${item.id}`)
          .then(() => this.items.splice(this.items.indexOf(this.items.find(i => i.id === item.id)), 1))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    save(item) {
      if (item.scope && item.scope.size > 0) {
        item.scope = Object.fromEntries(item.scope);
      }
      this.busy = true
      this.$http
          .put(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/rule`, item, {
            headers: {
              'content-type':'application/json',
            }
          })
          .then(result => {
            if (item.id) {
              this.items.splice(this.items.indexOf(this.items.find(i => i.id === item.id)), 1)
            }
            this.items.push(result.data)
            console.log(result.data)
          })
          .then(() => this.add(Snack.OK('Rule Saved!')))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    fetchItems() {
      this.loading = true
      this.items = []
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/rule`)
          .then(result => {
            this.items = result.data
            console.log(this.items)
          })
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.loading = false)
    },
  },


}
</script>
<style>
div.col-12:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > i:nth-child(1) {
  display: none;
}
</style>