<template>
  <v-container fluid>
    <v-row v-if="!showDetails" justify="center" align="center">
      <v-col cols="12" sm="8" md="8">
        <v-card>
          <v-card-title>
            <h2 class="headline">
              <span v-if="countyName !== null" v-text="countyName" />
              County Property Search
            </h2>
          </v-card-title>
          <v-card-text>
            <p
              v-if="errorText && errorText.length > 0"
              class="error--text font-weight-bold headline"
              v-text="errorText"
            />
            <p>
              Please fill in one or more of the fields below to search for
              properties.
            </p>
            <v-form>
              <v-row>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="accountNumber"
                    label="Account Number"
                    outlined
                    @keyup="checkSubmit"
                  />
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="ownerName"
                    label="Owner Name"
                    outlined
                    @keyup="checkSubmit"
                  />
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="pin"
                    label="PIN"
                    outlined
                    @keyup="checkSubmit"
                  />
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="propertyAddress"
                    label="Property Address"
                    outlined
                    @keyup="checkSubmit"
                  />
                </v-col>
                <v-col cols="12" class="text-right">
                  <v-btn color="primary" large @click="doSearch">
                    <v-icon class="mr-2"> mdi-magnify </v-icon>
                    Search
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col v-if="results && showResults" cols="12" sm="8">
        <v-card>
          <v-card-title>
            <h3 class="headline">{{ results.length }} Search Results</h3>
          </v-card-title>
          <v-card-text>
            <p>Click on a row to view Property Details.</p>
            <v-data-table
              :headers="headers"
              :items="results"
              @click:row="clickRow"
            >
              <template #item.ownerName="{ item }">
                <span v-html="item.ownerName" />
              </template>
              <template #item.propertyAddress="{ item }">
                <span v-html="item.propertyAddress" />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="details && showDetails" cols="12">
        <v-row class="d-print-none">
          <v-col cols="6" class="text-left">
            <v-btn color="primary" class="d-print-none" @click="doBack">
              <v-icon> mdi-chevron-left </v-icon>
              Back to Search
            </v-btn>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn color="success" class="d-print-none" @click="doPrint">
              <v-icon class="mr-2"> mdi-printer </v-icon>
              Print Screen
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title> Ownership Information </v-card-title>
              <v-card-text>
                <p>
                  <span class="font-weight-bold">Account Number:</span>
                  <span v-text="details.accountNumber" />
                </p>
                <p>
                  <span class="font-weight-bold">Parcel Number:</span>
                  <span v-text="details.parcelNumber" />
                </p>
                <v-divider />
                <p class="font-weight-bold">Owner(s)</p>
                <p>
                  <span v-html="details.ownerName" /><br />
                  <span v-html="details.mailingAddress" /><br />
                  {{ details.city }}, {{ details.state }} {{ details.zip }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Legal Description</v-card-title>
              <v-card-text>
                <p>
                  <span class="font-weight-bold">Property Address: </span>
                  {{ details.locationAddress }}
                </p>
                <p>
                  <span class="font-weight-bold">Property City: </span>
                  {{ details.locationCity }}
                </p>
                <v-divider />
                <p class="font-weight-bold">Legal Description:</p>
                <p>
                  {{ details.legalDescription }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Account Information</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="detailAccountHeaders"
                  :items="detailAccounts"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                >
                  <template #item.landGrossAcres="{ item }">
                    {{ formatDecimal(item.landGrossAcres) }}
                  </template>
                  <template #item.landGrossSqFt="{ item }">
                    {{ formatDecimal(item.landGrossSqFt) }}
                  </template>
                  <template #item.actualValue="{ item }">
                    ${{ formatDecimal(item.actualValue) }}
                  </template>
                  <template #item.assessedValue="{ item }">
                    ${{ formatDecimal(item.assessedValue) }}
                  </template>
                  <template #item.estimatedTax="{ item }">
                    ${{ formatDecimal(item.estimatedTax) }}
                  </template>
                </v-data-table>
                <div v-if="countyName === 'Niobrara'" class="well text-center">
                  You may view property tax information online at:
                  <a
                    :href="`https://itax.tylertech.com/NiobraraWY/detail.aspx?taxid=${details.accountNumber}`"
                  >
                    https://itax.tylertech.com/NiobraraWY/detail.aspx?taxid={{
                      details.accountNumber
                    }}
                  </a>
                  or contact the Niobrara County Treasurer at
                  <a href="tel:+13073342432">307-334-2432</a>.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Abstract Information</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="detailAbstractHeaders"
                  :items="details.abstractItems"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                >
                  <template #item.acres="{ item }">
                    {{ formatDecimal(item.acres) }}
                  </template>
                  <template #item.sqFt="{ item }">
                    {{ formatDecimal(item.sqFt) }}
                  </template>
                  <template #body.append="{ items }">
                    <tr>
                      <th class="text-start">Totals</th>
                      <td class="text-start"></td>
                      <td class="text-start">
                        {{ formatDecimal(totalAcres(items)) }}
                      </td>
                      <td class="text-start">
                        {{ formatDecimal(totalSqFt(items)) }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Building Improvements</v-card-title>
              <v-card-text>
                <v-data-table
                  v-model:expanded="detailBuildingImprovementsExpanded"
                  :headers="detailImprovementsHeaders"
                  :items="details.improvements"
                  :single-expand="false"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                  item-key="buildingId"
                  show-expand
                >
                  <template #expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold">Type</span>
                            </v-col>
                            <v-col cols="6">
                              {{ item.propertyType }}
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold">Description</span>
                            </v-col>
                            <v-col cols="6">
                              {{ item.description }}
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold">Bedrooms</span>
                            </v-col>
                            <v-col cols="6">
                              {{ item.bedroomCount }}
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold">Exterior</span>
                            </v-col>
                            <v-col cols="6">
                              {{ item.exterior }}
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold"
                                >Square Footage</span
                              >
                            </v-col>
                            <v-col cols="6">
                              {{ item.sqFt }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold">Building ID</span>
                            </v-col>
                            <v-col cols="6">
                              {{ item.buildingId }}
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold">Year Built</span>
                            </v-col>
                            <v-col cols="6">
                              {{ item.yearBuilt }}
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold">Bathrooms</span>
                            </v-col>
                            <v-col cols="6">
                              {{ item.bathCount }}
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold">Interior</span>
                            </v-col>
                            <v-col cols="6">
                              {{ item.interior }}
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="6">
                              <span class="font-weight-bold"
                                >HVAC Description</span
                              >
                            </v-col>
                            <v-col cols="6">
                              {{ item.hvac }}
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-data-table
                            :headers="detailImprovementDetailsHeaders"
                            :items="item.details"
                          />
                        </v-col>
                      </v-row>
                    </td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'CountyIndex',
  data: () => ({
    countyName: null,
    accountNumber: null,
    pin: null,
    ownerName: null,
    propertyAddress: null,
    errorText: null,
    results: null,
    showResults: false,
    details: null,
    showDetails: false,
    headers: [
      { text: 'Account Number', value: 'accountNumber' },
      { text: 'Owner Name(s)', value: 'ownerName' },
      { text: 'Address', value: 'propertyAddress' }
    ],
    detailAccounts: [],
    detailAccountHeaders: [
      { text: 'Account Type', value: 'accountType' },
      { text: 'Year', value: 'taxYear' },
      { text: 'Tax Area', value: 'taxArea' },
      { text: 'Mill Levy', value: 'millLevy' },
      { text: 'Gross Acres', value: 'landGrossAcres' },
      { text: 'Gross Sq. Ft.', value: 'landGrossSqFt' },
      { text: 'Actual Value', value: 'actualValue' },
      { text: 'Assessed Value', value: 'assessedValue' },
      { text: 'Estimated Tax Dollars', value: 'estimatedTax' }
    ],
    detailAbstractHeaders: [
      { text: 'Code', value: 'abstractCode' },
      { text: 'Description', value: 'abstractDescription' },
      { text: 'Acres', value: 'acres' },
      { text: 'Sq. Ft.', value: 'sqFt' }
    ],
    detailImprovementsHeaders: [
      { text: 'ID', value: 'buildingId' },
      { text: 'Year Built', value: 'yearBuilt' },
      { text: 'Description', value: 'description' },
      { text: 'Sq. Ft.', value: 'sqFt' }
    ],
    detailBuildingImprovementsExpanded: [],
    detailImprovementDetailsHeaders: [
      { text: 'Type', value: 'detailType' },
      { text: 'Description', value: 'detailDescription' },
      { text: 'Units', value: 'units' }
    ]
  }),
  mounted() {
    const s = this.$route.params.county
    this.countyName = s && s[0].toUpperCase() + s.slice(1)

    const q = this.$route.query
    if (q && q.accountNumber) {
      this.accountNumber = q.accountNumber
      this.doSearch()
    }
  },
  methods: {
    checkSubmit(e) {
      if (e.keyCode === 13) {
        this.doSearch()
      }
    },
    doSearch() {
      this.errorText = null

      if (
        (this.accountNumber === null || this.accountNumber === '') &&
        (this.pin === null || this.pin === '') &&
        (this.ownerName === null || this.ownerName === '') &&
        (this.propertyAddress === null || this.propertyAddress === '')
      ) {
        this.errorText = 'Please enter one or more fields.'
        return false
      }

      const body = {
        clientId: this.countyName
      }

      if (this.accountNumber !== null && this.accountNumber !== '') {
        body.accountNumber = this.accountNumber
      }
      if (this.pin !== null && this.pin !== '') {
        body.pin = this.pin
      }
      if (this.ownerName !== null && this.ownerName !== '') {
        body.ownerName = this.ownerName
      }
      if (this.propertyAddress !== null && this.propertyAddress !== '') {
        body.propertyAddress = this.propertyAddress
      }

      const url = '/search'

      this.$axios.post(url, body).then((res) => {
        if (res.status === 200) {
          this.results = res.data
          this.showDetails = false
          this.showResults = true
          if (this.results.length === 1) {
            const detailUrl =
              '/search/' +
              this.$route.params.county +
              '/' +
              this.results[0].accountNumber

            this.$axios.get(detailUrl).then((res) => {
              if (res.status === 200) {
                this.detailAccounts = []
                this.detailBuildingImprovementsExpanded = []
                this.details = res.data

                if (res.data.accounts && res.data.accounts.length > 0) {
                  const accountDetail = {
                    accountType: res.data.accounts[0].accountType,
                    taxArea: res.data.accounts[0].taxArea,
                    taxYear: res.data.accounts[0].taxYear,
                    millLevy: res.data.accounts[0].millLevy,
                    landGrossAcres: res.data.accounts[0].landGrossAcres,
                    landGrossSqFt: res.data.accounts[0].landGrossSqFt,
                    actualValue: _.sumBy(res.data.accounts, 'actualValue'),
                    assessedValue: _.sumBy(res.data.accounts, 'assessedValue'),
                    estimatedTax: _.sumBy(res.data.accounts, function (o) {
                      return parseFloat(o.estimatedTax)
                    })
                  }
                  this.detailAccounts.push(accountDetail)
                }

                this.showResults = false
                this.showDetails = true
              }
            })
          }
        }
      })
    },
    clickRow(item, info) {
      const url =
        '/search/' + this.$route.params.county + '/' + item.accountNumber

      this.$axios.get(url).then((res) => {
        if (res.status === 200) {
          this.detailAccounts = []
          this.detailBuildingImprovementsExpanded = []
          this.details = res.data

          if (res.data.accounts && res.data.accounts.length > 0) {
            const accountDetail = {
              accountType: res.data.accounts[0].accountType,
              taxArea: res.data.accounts[0].taxArea,
              taxYear: res.data.accounts[0].taxYear,
              millLevy: res.data.accounts[0].millLevy,
              landGrossAcres: res.data.accounts[0].landGrossAcres,
              landGrossSqFt: res.data.accounts[0].landGrossSqFt,
              actualValue: _.sumBy(res.data.accounts, 'actualValue'),
              assessedValue: _.sumBy(res.data.accounts, 'assessedValue'),
              estimatedTax: _.sumBy(res.data.accounts, function (o) {
                return parseFloat(o.estimatedTax)
              })
            }
            this.detailAccounts.push(accountDetail)
          }

          this.showResults = false
          this.showDetails = true
        }
      })
    },
    formatDecimal(number) {
      return Number(number).toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    totalSqFt(items) {
      let total = 0.0

      for (const item of items) {
        total += parseFloat(item.sqFt)
      }
      return total
    },
    totalAcres(items) {
      let total = 0.0

      for (const item of items) {
        total += parseFloat(item.acres)
      }

      return total
    },
    doPrint() {
      window.print()
    },
    doBack() {
      this.showDetails = false
      this.showResults = true
    }
  }
}
</script>
