<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          small
          :color="color"
          v-on="on"
          v-bind="attrs"
          @click="expand(!isExpanded)"
      >
        <v-icon small v-text="`mdi-chevron-${isExpanded ? 'up' : 'down'}`"/>
      </v-btn>
    </template>
    <span v-text="`${isExpanded ? 'Collapse' : 'Expand'} ${domain}`"/>
  </v-tooltip>
</template>
<script>
export default {
  namespaced: true,
  props: {
    color: String,
    expand: Function,
    isExpanded: Boolean,
    domain: String,
  },
}
</script>