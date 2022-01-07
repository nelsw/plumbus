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
                @click="handleSelectAll"
                hide-details
            />
          </div>
          <div class="d-flex flex">
            <FilterField :disabled="busy" ref="filter" @change="filter = $event"/>
          </div>
        </div>
        <v-card class="mx-auto overflow-y-auto" max-height="400">
          <v-card-text class="mx-auto">
            <v-list dense>
              <v-list-item dense v-for="(item, index) in computedItems" :key="index">
                <v-list-item-action class="ma-0 mr-3">
                  <v-checkbox
                      v-model="item.active"
                      color="primary"
                      @click="handleSelection(item)"
                  />
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"/>
                </v-list-item-content>
                </v-list-item>
            </v-list>
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
    selectAllModel: false,
    busy: true,
    show: true,
    items: [],
    filter: null,
  }),

  mounted() {
    if (!this.item.scope) this.item.scope = []
    this.fetchItems()
  },

  computed: {
    computedItems() {
      return this.filter && this.filter !== ''
          ? this.items.filter(item => item.id.includes(this.filter) || item.name.includes(this.filter))
          : this.items
    },
    indeterminateSelection() {
      return this.item.scope && this.item.scope.length > 0 && this.item.scope.length !== this.items.length
    }
  },

  methods: {
    ...mapActions('snack', ['add']),

    fetchItems() {
      this.busy = true
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/tree`)
          .then(result => this.items = result.data.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    handleSelectAll() {
      this.item.scope = []
      this.items.forEach(item => {
        item.active = this.selectAllModel
        if (item.active) {
          this.item.scope.push(item.id)
        }
      })
    },

    handleSelection(item) {
      if (item.active) {
        this.item.scope.push(item.id)
      } else {
        this.item.scope.splice(this.item.scope.indexOf(item.id), 1)
      }
    },
  },
}
</script>
