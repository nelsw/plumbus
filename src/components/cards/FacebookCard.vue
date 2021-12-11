<template>
  <v-card raised rounded elevation="24">
    <v-toolbar>
      <v-icon v-text="`mdi-facebook`" class="mr-5"/>
      <v-toolbar-title>
        <span v-text="`facebook`"/>
        <span
            class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down"
            v-text="`ad spend & revenue`"
        />
      </v-toolbar-title>
    </v-toolbar>
    <v-data-table
        multi-sort
        show-expand
        show-group-by
        :items="items"
        :loading="loading"
        :search="$refs.filter ? $refs.filter.$data.model : ''"
        :headers="[
          {text: 'User',  value: 'userId', align: 'start', width: 150},
          {text: 'Post', value: 'id', width: 150},
          {text: 'Title', value: 'title'},
          {text: 'Body', value: 'body'},
          {text: '', value: '', divider: true, groupable: false},
          {text: '', value: 'data-table-expand', groupable: false},
        ]"
    >
      <template v-slot:top>
        <div class="d-flex flex flex-row align-end">
          <v-icon v-text="`mdi-alpha`" class="mb-1"/>
          <div class="mr-2" style="max-width: 65px">
            <DatePicker alpha/>
          </div>
          <div style="max-width: 40px">
            <TimePicker/>
          </div>
          <v-icon v-text="`mdi-omega`" class="mb-1 ml-3"/>
          <div class="mr-2" style="max-width: 65px">
            <DatePicker/>
          </div>
          <div style="max-width: 40px">
            <TimePicker/>
          </div>
          <SimpleButton text="search" class="ml-5" small @click="fetchItems"/>
          <v-spacer/>
          <FilterField ref="filter"/>
          <v-spacer/>
          <div>
            <span>
              Spend:
            </span>
                <span>
              Revenue:
            </span>
                <span>
              Profit:
            </span>
          </div>
        </div>
      </template>
      <template v-slot:item.data-table-expand="{isSelected, item, expand, isExpanded}">
        <div class="d-flex flex flex-row align-center">
          <TooltipButton v-if="item.enabled" small tooltip="Pause Ad" icon="mdi-pause-circle" color="warning"/>
          <TooltipButton v-else small tooltip="Start Ad" icon="mdi-play-circle" color="green"/>
          <ExpandButton
              :tooltip="`${isExpanded ? 'Collapse' : 'Expand'} Result`"
              :expand="expand"
              :is-expanded="isExpanded"
          />
        </div>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          {{ item.id }}
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import FilterField from "@/components/fields/FilterField";
import ExpandButton from "@/components/buttons/ExpandButton";
import TooltipButton from "@/components/buttons/TooltipButton";
import DatePicker from "@/components/pickers/DatePicker";
import TimePicker from "@/components/pickers/TimePicker";
import SimpleButton from "@/components/buttons/SimpleButton";
export default {
  components: {SimpleButton, TimePicker, DatePicker, TooltipButton, ExpandButton, FilterField},
  namespaced: true,

  data: () => ({
    loading: true,
    items: [],
  }),

  mounted() {
    this.fetchItems()
  },

  methods: {

    fetchItems() {
      this.loading = true
      this.items = []
      this.$http
          .get(`https://jsonplaceholder.typicode.com/posts`)
          .then(result => this.items = result.data)
          .finally(() => {
            this.loading = false
            this.$refs.filter.$refs.field.focus()
            setTimeout(() => this.fetchItems(), 60 * 1000);
          })
    },

  },

}
</script>