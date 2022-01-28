<template>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon :small="small" :color="color" v-on="on" v-bind="attrs" @click="expand(!isExpanded)" :disabled="disabled">
          <v-icon :small="small" v-text="`mdi-chevron-${isExpanded ? 'up' : 'down'}`"/>
        </v-btn>
      </template>
      <span v-text="`${isExpanded ? 'Collapse' : 'Expand'} ${domain}`"/>
    </v-tooltip>
</template>
<script>
export default {
  namespaced: true,
  props: {
    small: Boolean,
    domain: String,
    color: String,
    expand: Function,
    isExpanded: Boolean,
    disabled: Boolean,
  },
}
</script>