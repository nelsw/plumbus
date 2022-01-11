<template>
  <v-card raised rounded elevation="24" :loading="busy" :disabled="busy">
    <v-toolbar style="background-color: gray" dense>
      <span class="text-h6" v-text="`Scope`"/>
      <v-spacer/>
      <TooltipButton
          :icon="`mdi-chevron-${show ? 'up' : 'down'}`"
          :tooltip="`${show ? 'Collapse' : 'Expand'} Scope`"
          @click="show = !show"
      />
    </v-toolbar>
    <v-expand-transition>
      <div v-if="show">
        <div class="d-flex flex flex-row align-center justify-space-around px-4 mb-1">
          <div class="d-flex flex">
            <v-checkbox
                v-model="selectAllModel"
                :indeterminate="indeterminateSelection"
                label="Select All"
                hide-details
            />
          </div>
          <div class="d-flex flex">
            <FilterField :disabled="busy" ref="filter" @change="filter = $event"/>
          </div>
        </div>
        <v-card class="mx-auto overflow-y-auto" max-height="400">
          <v-card-text class="mx-auto">
            <v-treeview
                dense
                selectable
                open-on-click
                selection-type="leaf"
                selected-color="primary"
                expand-icon="mdi-chevron-down"
                :items="computedItems"
                v-model="selected"
                item-key="id"
                @input="bar"
                return-object
            >
              <template v-slot:prepend="{ item }">
                <v-icon v-text="`mdi-chess-${item.status ? 'king' : 'queen'}`"/>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import TooltipButton from "@/components/buttons/TooltipButton";
import {mapActions} from "vuex";
import Snack from "@/models/Snack";
import FilterField from "@/components/fields/FilterField";
import _groupBy from 'lodash/groupBy'

export default {
  components: {FilterField, TooltipButton},

  namespaced: true,

  props: {
    item: Object,
  },

  data: () => ({
    active: [],
    selectAllModel: false,
    indeterminateSelection: false,
    busy: true,
    show: true,
    items: [],
    selected: [],
    filter: null,
    allCampaigns: [],
    allAccounts: [],
    all: 0,
    legend: new Map(),
    wat: [],
    accountCount: 0,
  }),

  mounted() {
    this.fetchItems()
  },

  computed: {

    computedItems() {
      if (!this.filter || this.filter === '' || this.items.length === 0) return this.items
      return this.items.filter(item => item.name.includes(this.filter))
    },
    computedValue() {
      console.log('selected')
      this.$debug(this.selected)
      return this.selected
    },
  },

  watch: {
    selectAllModel() {
      this.selected = this.selectAllModel ? this.items : []
    },
    selected() {
      console.log("selected ")
      this.$debug(this.selected)
      //   let sel = this.selected.length, aaa = this.allAccounts.length, ccc = this.allCampaigns.length
      //   console.log(sel, ccc, aaa)
      //   if (sel === 0) {
      //     this.item.campaign_ids = []
      //     console.log("sel === 0")
      //   } else if (sel === this.all) {
      //     this.item.campaign_ids = this.allCampaigns
      //     console.log("sel === aaa || sel === ccc")
      //   } else {
      //     console.log("else")
      //     this.item.campaign_ids = this.selected
      //     this.indeterminateSelection = true
      //   }
    }
  },

  methods: {
    ...mapActions('snack', ['add']),

    fetchItems() {
      this.busy = true
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/agg?node=root`)
          .then(result => this.items = result.data.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
          .then(() => {
            this.items.forEach(item => {
              ++this.accountCount
              this.legend.set(item.id, item.children.length)
            })
          })
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    debug() {
      this.$debug(this.item)
    },

    bar(items) {

      this.item.account_ids = []
      this.item.campaign_ids = []

      if (items.length === 0) {
        this.indeterminateSelection = false
        console.log("empty")
        return
      }

      if (items.length === 1) {
        console.log("one item")
        let item = items[0]
        if (item.account_id) {
          console.log("campaign")
          this.item.campaign_ids.push(item.id)
        } else {
          console.log("account")
          this.item.account_ids.push(item.id)
        }
        return
      }

      this.item.account_ids = items.filter(item => item.status).map(account => account.id)

      Object.entries(_groupBy(items.filter(item => !item.status), 'account_id')).forEach(e => {
        let key = e[0], val=e[1]
        if (this.legend.get(key) === val.length) {
          console.log("all kids")
          this.item.account_ids.push(key)
        } else {
          console.log("partial")
          this.item.campaign_ids.push(...val.map(v => v.id))
        }
      })

      let aa = this.item.account_ids.length
      let zz = this.items.length

      this.indeterminateSelection = aa !== zz
    },
  },
}
</script>
