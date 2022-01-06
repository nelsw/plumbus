<template>
  <div>
    <v-tooltip
        v-if="tooltip"
        top
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            icon
            small
            :color="color"
            v-on="on"
            v-bind="attrs"
            @click="expand(!isExpanded)"
        >
          <v-icon
              small
              v-text="`mdi-chevron-${isExpanded ? 'up' : 'down'}`"
          />
        </v-btn>
      </template>
      <span
          v-text="tooltip"
      />
    </v-tooltip>
    <v-btn
        v-else
        icon
        small
        :color="color"
        @click="expand(!isExpanded)"
    >
      <v-icon
          small
          v-text="`mdi-chevron-${isExpanded ? 'up' : 'down'}`"
      />
    </v-btn>
  </div>
</template>
<script>
export default {
  namespaced: true,
  props: {
    color: String,
    expand: Function,
    isExpanded: Boolean,
    tooltip: String,
  },
}
</script>