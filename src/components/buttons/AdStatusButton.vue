<template>
  <div>
    <TooltipButton
        small
        :loading="busy"
        :color="isActive() ? 'light-green accent-3' : 'blue-grey'"
        :icon="`mdi-toggle-switch${isActive() ? '' : '-off'}-outline`"
        :tooltip="`${isActive() ? 'Pause' : 'Activate'} Campaign`"
        @click="click"
    />
    <BiDialog
        ref="statusDialog"
        title="Change Account Status?"
        text="This will update every campaign under this account ..."
        @yes="updateAccount"
        @no="busy=false"
    />
  </div>
</template>

<script>
import TooltipButton from "@/components/buttons/TooltipButton";
import {mapActions} from "vuex";
import Snack from "@/models/Snack";
import BiDialog from "@/components/dialogs/BiDialog";

export default {
  components: {BiDialog, TooltipButton},
  namespaced: true,

  props: {
    item: Object,
  },

  data: () => ({
    busy: false,
  }),

  methods: {
    ...mapActions('snack', ['add']),

    isAccount() {
      return this.item.included !== undefined
    },

    isActive() {
      return this.isAccount()
          ? this.item.status === 'Active'
          : this.item.status === 'ACTIVE'
    },

    click() {
      this.busy = true
      if (this.isAccount()) {
        this.$refs.statusDialog.load()
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
          .patch(this.$api('campaign') + `?accountID=${accountID}&ID=${ID}&status=${status}`)
          .then(() => this.item.status = status)
          .then(() => this.add(Snack.OK(`Campaign ${ID} ${status}!`)))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },
  }
}
</script>
