<template>
<div id="app">
  <v-app id="inspire">
    <v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <span class="hidden-sm-and-down">Table Number - {{ displayTableNumber($route.params.tableName) }}</span>
      </v-toolbar-title>
      <v-text-field
        v-model="search"
        flat
        solo-inverted
        prepend-icon="search"
        label="Search"
        class="hidden-sm-and-down"
        @input="foodFilter()"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn flat icon color="white" @click="checkout()">
        <v-icon>thumb_up</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
        <v-flex xs12 sm12 style="margin: 1%">
        <v-card>
          <v-card-title>
             <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex class="text-xs-center" xs12 align-end flexbox>
                  <span class="headline">ADD ITEM</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-title>
          <v-container>
              <v-layout row justify-space-between>
                <v-flex xs6  flexbox>
                    <span style="font-size:25px;margin-right:1%">Table Number:</span>
                    <span style="font-size:25px;color:red"> 1 </span>
                </v-flex>
                <v-flex xs3 align-end flexbox>
                    <v-select
                        :items="items"
                        v-model="waiterId"
                        label="Waiter Id"
                        single-line
                        color="red"
                    ></v-select>
                </v-flex>
              </v-layout>
            <v-divider></v-divider>
            <v-flex xs12 align-end flexbox>
                  <span style="font-size:25px;margin-right:1%">Quntity:</span>
                  <v-btn fab dark small color="red" @click="removeOrder()"><v-icon dark>remove</v-icon></v-btn>
                  <span style="font-size:20px;color:red">{{ items.KOTQuantity }}</span>
                  <v-btn fab dark small color="green" @click="addOrder()"><v-icon dark>add</v-icon></v-btn>
            </v-flex>
            <v-divider></v-divider>
            <v-flex xs12 align-end flexbox>
              <v-text-field
                v-model="items.KOTRate"
                label="Rate"
                @input="calculateAmount()"
              ></v-text-field>
            </v-flex>
             <v-flex xs12 align-end flexbox>
              <v-text-field
                v-model="items.KOTAmount"
                label="Amount"
                disabled
              ></v-text-field>
            </v-flex>
            <v-flex xs12 align-end flexbox>
               <v-text-field
               v-model="items.AdditionalInstructions"
                color="teal"
                multi-line>
                <div slot="label">
                  Additional Note: <small>(optional)</small>
                </div>
              </v-text-field>
            </v-flex>
          </v-container>
        </v-card>
      </v-flex>
    </v-content>
  </v-app>
</div>
</template>
<script>
import axios from './Services/httpClient.js'
export default {
  data () {
    return {
      dialog: false,
      drawer: null,
      search: '',
      notifications: false,
      sound: true,
      widgets: false,
      waiterId: '',
      items: {
        ItemId: '',
        SlNo: '',
        ItemName: '',
        KOTQuantity: 1,
        KOTRate: 1,
        KOTAmount: 0,
        AdditionalInstructions: ''
      }
    }
  },
  mounted () {
    const url = process.env.API_BASE.concat('/api/AuthenticateUser?')
    console.log('ENV', url)
  },
  props: {
    source: String
  },
  beforeMount () {
    this.getWaiterList()
  },
  methods: {
    displayTableNumber (name) {
      if (!(name === undefined)) {
        localStorage.setItem('TableName', name)
      }
      return localStorage.getItem('TableName')
    },
    getWaiterList () {
      axios.getWaiterList().then((data) => {
        console.log('Waiter Data', data)
      })
    }
  }
}
</script>
<style>

</style>