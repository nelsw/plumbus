<template>
  <v-tooltip v-if="tooltip" top :bottom="bottom">
    <template v-slot:activator="{ on, attrs }">
      <SimpleButton
        :x-small="xsmall"
        :small="small"
        :color="color"
        :icon="icon"
        :text="text"
        :loading="loading"
        :disabled="disabled"
        :on="on"
        :attrs="attrs"
        />
    </template>
    <span v-text="tooltip"/>
  </v-tooltip>
</template>

<script>
import SimpleButton from "@/components/buttons/SimpleButton";
export default {
  components: {SimpleButton},
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
    bottom: Boolean,
    on: Object,
    attrs: Object,
  },
}
</script>