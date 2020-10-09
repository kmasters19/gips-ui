<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to the Geographic Innovations Property Search System
        </v-card-title>
        <v-card-text>
          <p>Please select the county that you'd like to query.</p>
          <div>
            <v-select :items="counties" @change="setSelectedCounty"></v-select>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            nuxt
            :to="`/${selectedCounty}`"
            :disabled="selectedCounty === null"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    VuetifyLogo
  },
  data: () => ({
    counties: [
      { text: 'Niobrara County, WY', value: 'niobrara' },
      { text: 'Weston County, WY', value: 'weston' }
    ],
    selectedCounty: null
  }),
  mounted() {
    this.$axios.get('/search/counties').then((res) => {
      if (res.status === 200) {
        this.counties = []
        for (const county of res.data) {
          const countyName = county[0].toUpperCase() + county.slice(1)
          this.counties.push({ text: countyName + ' County', value: county })
        }
      }
    })
  },
  methods: {
    setSelectedCounty(e) {
      this.selectedCounty = e
    }
  }
}
</script>
