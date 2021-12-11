<template>
  <v-btn
      elevation="24"
      :loading="loading"
      :disabled="disabled"
      :small="small"
      :x-small="xsmall"
      :outlined="text && text.match(/no|cancel/) !== null"
      :color="color ? color : text && text.match(/save|ok|yes|delete|search|create/) ? 'primary' : ''"
      v-text="text"
      @click="$emit('click')"
  />
</template>

<script>
export default {
  namespaced: true,
  props: {

    // aesthetic
    xsmall: Boolean,
    small: Boolean,
    color: String,

    // information
    text: String,

    // state
    loading: Boolean,
    disabled: Boolean,
  },
}
</script>