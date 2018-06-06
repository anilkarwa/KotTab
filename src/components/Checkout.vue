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
                        :items="waiterData"
                        v-model="waiterId"
                        label="Select Waiter Id"
                        single-line
                        item-text="WTRName"
                        item-value="WTRID"
                        autocomplete
                    ></v-select>
                </v-flex>
              </v-layout>
            <v-divider></v-divider>
               <v-layout row justify-space-between>
                <v-flex xs6  flexbox>
                    <span style="font-size:25px;margin-right:1%">Order List:</span>
                </v-flex>
                <v-flex xs3 align-end flexbox>
                    <v-btn depressed color="info">Add Items</v-btn>
                </v-flex>
              </v-layout>
              <v-layout row justify-center>
                 <v-data-table
                  :headers="headers"
                  :items="Orderitems"
                  hide-actions
                  class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.ItemName }}</td>
                      <td class="text-xs-right">{{ props.item.KOTQuantity }}</td>
                      <td class="text-xs-right">{{ props.item.KOTRate }}</td>
                      <td class="text-xs-right">{{ props.item.KOTAmount }}</td>
                      <!-- <td class="justify-center layout px-0">
                        <v-btn icon class="mx-0">
                          <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0">
                          <v-icon color="pink">delete</v-icon>
                        </v-btn>
                      </td> -->
                    </template>
                    <template slot="no-data">
                      <!-- <v-btn color="primary">Reset</v-btn> -->
                      <p>No Order Available for This Table</p>
                    </template>
                  </v-data-table>
              </v-layout>
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
      },
      waiterData: [],
      headers: [
        {
          text: 'Item Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Quantity', value: 'calories' },
        { text: 'Rate', value: 'fat' },
        { text: 'Amount', value: 'carbs' }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      Orderitems: []
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
    this.loadOrderItem()
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
        this.waiterData = data
      })
    },
    loadOrderItem () {
      var Order = []
      Order = JSON.parse(localStorage.getItem('Orders'))
      console.log('Order', Order)
      this.Orderitems = Order
    }
  }
}
</script>
<style>

</style>