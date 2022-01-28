<template>
  <v-badge
      :dot="dot"
      :color="color"
      :inline="inline"
  />
</template>

<script>
export default {
  namespaced: true,
  props: {
    dot: Boolean,
    color: String,
    inline: Boolean,
  },
}
</script>
