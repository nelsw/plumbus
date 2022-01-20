<template>
  <TooltipButton small :loading="busy" :color="color" :icon="icon" :tooltip="tooltip" @click="click"/>
</template>

<script>
import TooltipButton from "@/components/buttons/TooltipButton";
import {mapActions} from "vuex";
import Snack from "@/models/Snack";

export default {
  components: {TooltipButton},
  namespaced: true,

  props: {
    item: Object,
  },

  data: () => ({
    busy: false,
  }),

  computed: {
    color() {
      return this.isActive() ? 'warning' : 'success'
    },
    icon() {
      return `mdi-${this.isActive() ? 'pause' : 'play'}`
    },
    tooltip() {
      return `${this.isActive() ? 'Pause' : 'Activate'} Campaign`
    },
  },

  methods: {
    ...mapActions('snack', ['add']),

    isAccount() {
      return !this.item.id
    },

    isActive() {
      return this.isAccount()
          ? this.item.status === 'Active'
          : this.item.status === 'ACTIVE'
    },

    click() {
      this.busy = true
      if (this.isAccount()) {
        this.updateAccount()
      } else {
        this.updateCampaign()
      }
    },

    updateAccount() {
      let accountID = this.item.account_id
      let status = this.isActive() ? 'PAUSED' : 'ACTIVE'
      this.$http
          .patch(this.$api('campaign') + `?accountID=${accountID}&status=${status}`)
          .then(() => this.add(Snack.OK(`Account ${accountID} Campaigns ${status}!`)))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    updateCampaign() {
      let ID = this.item.id
      let accountID = this.item.account_id
      let status = this.isActive() ? 'PAUSED' : 'ACTIVE'
      this.$http
          .patch(this.$api('campaign') + `?accountID=${accountID}&campaignIDS=${ID}&status=${status}`)
          .then(() => this.item.status = status)
          .then(() => this.add(Snack.OK(`Campaign ${ID} ${status}!`)))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },
  }
}
</script>
