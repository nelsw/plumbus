<template>
  <v-card raised rounded elevation="24" :loading="busy" :disabled="busy">
    <v-toolbar style="background-color: gray" dense>
      <span class="text-h6" v-text="`Scope`"/>
      <v-spacer/>
      <TooltipButton
          :icon="`mdi-chevron-${show ? 'up' : 'down'}`"
          :tooltip="`${show ? 'Collapse' : 'Expand'}`"
          @click="show = !show"
      />
    </v-toolbar>
    <v-expand-transition>
      <div v-if="show">

        <div class="d-flex flex flex-row align-center justify-space-around px-4 mb-1">

          <div class="d-flex flex">
            <v-checkbox
                v-model="selectAllModel"
                :indeterminate="indeterminateModel"
                label="Select All"
                @click="handleSelectAllClick"
                hide-details
            />
          </div>

          <div class="d-flex flex">
  <FilterField :loading="false" :disabled="busy" ref="filter"/>
</div>


        </div>

        <v-card class="mx-auto overflow-y-auto" max-height="400">
          <v-card-text class="mx-auto">
            <v-list dense>
              <v-list-item dense v-for="(item, index) in items" :key="index">
                    <v-list-item-action class="ma-0 mr-3">
                      <v-checkbox :input-value="item.active" color="primary" @click="handleSelectClick(item)"/>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{item.name}}</v-list-item-title>
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
  namespaced: true,
  components: {FilterField, TooltipButton},

  props: {
    item: Object,
  },

  data: () => ({
    selectAllModel: false,
    indeterminateModel: false,
    all: false,
    busy: true,
    show: true,
    valid: true,
    items: [],
    open: [],
    selected: [],
  }),

  mounted() {
    this.fetchItems()
  },

  watch: {
    all() {
      let selected = []
      if (this.all) {
        this.items.forEach(item => {
          if (item.children) {
            item.children.forEach(child => selected.push(child.id))
          }
        })
      }
      this.selected = selected
    }
  },

  computed: {
    search() {
      if (this.$refs.filter && this.$refs.filter.model) {
        return this.$refs.filter.model
      }
      return null
    },
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

    debug() {
      this.$debug(this.items)
    },

    handleSelectAllClick() {
      this.items.forEach(item => item.active = this.selectAllModel)
      this.indeterminateModel = false
    },

    handleSelectClick(item) {
      item.active = !item.active
      let act = 0
      this.items.forEach(item => {
        if (item.active) {
          ++act
        }
      })
      this.indeterminateModel = act > 0 && act !== this.items.length
    },
  },
}
</script>
