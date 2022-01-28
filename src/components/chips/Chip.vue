<template>
  <v-chip
      v-show="valid"
      :class="clazz"
      :color="color"
      :small="small"
      outlined
      label
      :disabled="disabled"
      v-text="text"
  />
</template>

<script>
export default {
  namespaced: true,
  props: {
    float: Number,
    text: String,
    clazz: String,
    dot: Boolean,
    small: Boolean,
    inline: Boolean,
  },

  computed: {

    valid() {
      return this.text !== ""
    },

    disabled() {
      return this.text === "0%"
    },

    color() {
      if (this.float <= -100) {
        return 'pink accent-3'
      } else if (this.float < -35) {
        return 'orange accent-3'
      } else if (this.float < 0) {
        return 'amber accent-3'
      } else if (this.float > 100) {
        return 'green accent-3'
      } else if (this.float > 35) {
        return 'teal accent-3'
      } else if (!this.disabled) {
        return 'cyan accent-3'
      } else {
        return ''
      }
    }
  },

}
</script>