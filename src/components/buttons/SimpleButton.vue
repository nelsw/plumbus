<template>
  <span>
    <v-btn
        v-on="on"
        v-bind="attrs"
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
    <v-icon
        v-if="icon"
        v-text="icon"
        :small="small"
        :x-small="xsmall"
    />
  </span>
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
    icon: String,
    text: String,

    // state
    loading: Boolean,
    disabled: Boolean,

    // tooltip
    on: Object,
    attrs: Object,
  },
}
</script>