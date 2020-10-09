<template>
  <v-container fluid>
    Account Details
    <span v-if="accountNumber !== null" v-text="`for ${accountNumber}`" />
  </v-container>
</template>

<script>
export default {
  name: 'PropertyDetails',
  data: () => ({
    accountNumber: null
  }),
  mounted() {
    this.accountNumber = this.$route.params.accountNumber
  }
}
</script>
