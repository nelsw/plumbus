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
            <FilterField :disabled="busy" ref="filter" @change="filter = $event"/>
          </div>
        </div>
        <v-card class="mx-auto overflow-y-auto" max-height="400">
          <v-card-text class="mx-auto">
            <v-treeview
                dense
                selectable
                open-on-click
                selected-color="primary"
                :items="computedItems"
                v-model="selected"
                item-key="id"
            >
              <template v-slot:label="{ item, leaf, selected, indeterminate, active, open }" >
                {{ wat(item, leaf, selected, indeterminate, active, open) ? item.name : item.name }}
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

export default {
  components: {FilterField, TooltipButton},

  namespaced: true,

  props: {
    item: Object,
  },

  data: () => ({
    busy: true,
    show: true,
    items: [],
    selected: [],
    filter: null,
    legend: null,
    scope: null,
  }),

  mounted() {
    this.fetchItems()
  },

  computed: {
    computedItems() {
      if (!this.filter || this.filter === '' || this.items.length === 0) return this.items
      return this.items.filter(item => item.name.toLowerCase().includes(this.filter.toLowerCase()))
    },
  },

  methods: {
    ...mapActions('snack', ['add']),

    wat(item, leaf, selected, indeterminate) {

      if (this.busy || indeterminate) {
        return
      }

      let id = item.id, accountID = item.account_id
      let isAccount = id === accountID

      if (!selected && !this.scope.has(accountID)) {
        return
      }

      if (!selected && isAccount) {
        this.scope.delete(accountID)
        return
      }

      if (!selected) {
        let ids = this.scope.get(accountID)
        if (ids.length === 0) {
          ids = this.legend.get(accountID)
        }
        if (ids.includes(id)) {
          ids = ids.filter(i => i !== id)
          this.scope.set(accountID, ids)
        }
        return
      }

      if (isAccount) {
        this.scope.set(accountID, this.legend.get(accountID))
        return
      }

      if (!this.scope.has(accountID)) {
        this.scope.set(accountID, [id])
        return
      }

      let ids = this.scope.get(accountID)
      if (ids.includes(id)) {
        return
      }

      ids.push(id)
      this.scope.set(accountID, ids)
      return null
    },

    fetchItems() {
      this.legend = null
      this.scope = null
      this.busy = true
      this.$http
          .get(this.$api('account') + `?pos=in`)
          .then(result => this.items = result.data)
          .then(() => {
            this.legend = new Map()
            this.items.forEach(item => this.legend.set(item.id, item.children ? item.children.map(child => child.id) : []))
          })
          .then(() => {

            let arr = Object.entries(this.item.scope)
            this.scope = new Map(arr)

            for (let i = 0; i < arr.length; i++) {

              let id = arr[i][0],
                  ids = arr[i][1],
                  got = ids.length,
                  all = this.legend.get(id).length

              if (got + all === 0) {
                ids = [id]
              } else if (all > 0 && got === 0) {
                ids = this.items.find(item => item.id === id).children.map(item => item.id)
              }

              this.selected.push(...ids)
            }
          })
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    setScope() {
      let m = new Map()
      this.scope.forEach((ids, id) => {
        if (ids.length === this.legend.get(id).length) {
          m.set(id, [])
        } else {
          m.set(id, ids)
        }
      })
      this.item.scope = Object.fromEntries(m)
    },
  },
}
</script>
