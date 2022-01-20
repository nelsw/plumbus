<template>
  <v-tooltip top :bottom="bottom" :right="right">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          :small="small"
          :x-small="xsmall"
          v-on="on"
          v-bind="attrs"
          :color="color"
          :loading="loading"
          :disabled="disabled"
          @click="$emit('click')"
      >
        <v-icon
            v-text="icon"
            :small="small"
            :x-small="xsmall"
        />
      </v-btn>
    </template>
    <span v-text="tooltip"/>
  </v-tooltip>
</template>

<script>
export default {
  namespaced: true,
  props: {

    xsmall: Boolean,
    small: Boolean,
    color: String,

    icon: String,
    text: String,

    loading: Boolean,
    disabled: Boolean,

    tooltip: String,
    left: Boolean,
    right: Boolean,
    bottom: Boolean,
    top: Boolean,
  },
}
</script>