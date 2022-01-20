<template>
  <v-row justify="center">
    <v-dialog @keydown.esc="close" v-model="show" fullscreen hide-overlay transition="scale-transition">
      <CampaignTable ref="campaignTable" :accountID="accountID" @close="close"/>
    </v-dialog>
  </v-row>
</template>

<script>
import CampaignTable from "@/components/tables/CampaignTable";

export default {
  components: {CampaignTable},
  namespaced: true,

  data: () => ({
    show: false,
    accountID: null,
  }),

  methods: {
    open(accountID) {
      this.accountID = accountID
      this.show = true
      this.$refs.campaignTable.fetchItems()
    },
    close() {
      this.$refs.campaignTable.$data.busy = true
      this.show = false
    },
  },

}
</script>
