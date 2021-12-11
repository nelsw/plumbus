<template>
  <v-card raised rounded elevation="24">
    <v-toolbar color="#3b5998">
      <v-icon color="white" v-text="`mdi-facebook`" class="mr-5"/>
      <v-toolbar-title>
        <span style="color: white" v-text="`facebook`"/>
        <span
            style="color: white"
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
          {text: 'User',  value: 'userId', align: 'start'},
          {text: 'Post', value: 'id'},
          {text: 'Title', value: 'title'},
          {text: 'Body', value: 'body'},
          {text: '', value: '', divider: true, groupable: false},
          {text: '', value: 'data-table-expand', groupable: false},
        ]"
    >
      <template v-slot:top>
        <FilterField ref="filter"/>
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
export default {
  components: {TooltipButton, ExpandButton, FilterField},
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
          .finally(() => this.loading = false)
    },

  },

}
</script>