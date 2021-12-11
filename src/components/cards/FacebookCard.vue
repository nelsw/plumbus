<template>
  <v-card raised rounded elevation="24" :loading="loading" :disabled="disabled">
    <v-toolbar color="#3b5998">
      <v-icon v-text="`facebook`"/>
      <v-toolbar-title v-text="`Facebook`"/>
      <v-toolbar-title>
        Facebook
        <span
            class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down"
            v-text="`Facebook Revenue vs Spend Results.`"
        />
      </v-toolbar-title>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  namespaced: true,

  data: () => ({

    loading: true,
    disabled: false,

  }),

}
</script>

<style scoped>

</style>