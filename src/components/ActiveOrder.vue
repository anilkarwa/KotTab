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
        <v-icon>assignment_turned_in</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
        <v-flex xs12 sm12 style="margin: 1%">
        <v-card>
          <v-card-title>
             <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex class="text-xs-center" xs12 align-end flexbox v-if="activeOrder">
                  <span class="headline">Active Order</span>
                </v-flex>
                <v-flex class="text-xs-center" xs12 align-end flexbox v-if="newOrder">
                  <span class="headline">New Order</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-title>
          <v-container>
              <v-layout row justify-space-between>
                <v-flex xs6  flexbox>
                    <span style="font-size:25px;margin-right:1%">Table Number:</span>
                    <span style="font-size:25px;color:red"> {{ displayTableNumber($route.params.tableName,$route.params.tableNumber) }} </span>
                </v-flex>
                <v-flex xs3 align-end flexbox>
                     <span style="font-size:25px;margin-right:1%">Waiter Id:</span>
                    <span style="font-size:25px;color:red"> {{waiterId}} </span>
                </v-flex>
              </v-layout>
            <v-divider></v-divider>
               <v-layout row justify-space-between>
                <v-flex xs4  flexbox v-if="activeOrder">
                    <span style="font-size:25px;margin-right:1%">Active Order List:</span>
                </v-flex>
                <v-flex xs4  flexbox v-if="newOrder">
                    <span style="font-size:25px;margin-right:1%">New Order List:</span>
                </v-flex>
                <v-flex xs4 align-end flexbox v-if="activeOrder" @click="changeOrders()">
                    <v-btn depressed color="info">New Orders</v-btn>
                </v-flex>
                <v-flex xs5 align-end flexbox v-if="newOrder">
                    <router-link to="/menu">
                    <v-btn depressed color="info">Add Items</v-btn>
                    </router-link>
                    <v-btn depressed color="info" @click="changeOrders()">Check Active Order</v-btn>
                </v-flex>
              </v-layout>
              <v-layout row justify-center v-if="activeOrder">
                 <v-data-table
                  :headers="headers"
                  :items="activeOrderItems"
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
              <v-layout row justify-center v-if="newOrder">
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
      <v-snackbar
        :timeout="timeout2"
        :top="y === 'top'"
        :vertical="mode === 'multi-line'"
        :color="snackbar2color"
        v-model="snackbar2"
      >
        {{ snackbar2text }}
        <v-btn flat color="black" @click.native="snackbar2 = false">Close</v-btn>
      </v-snackbar>
  </v-app>
</div>
</template>
<script>
import router from '../router'
import axios from './Services/httpClient.js'
export default {
  data () {
    return {
      activeOrder: true,
      newOrder: false,
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
      Orderitems: [],
      activeOrderItems: [],
      snackbar2: false,
      timeout2: 6000,
      snackbar2text: 'Order placed Successfully',
      snackbar2color: 'success',
      y: 'bottom',
      mode: '',
      KOTNumber: 0
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
    this.fetchActiveOrderList()
  },
  methods: {
    displayTableNumber (name, number) {
      if (!(name === undefined)) {
        localStorage.setItem('TableName', name)
      }
      if (!(number === undefined)) {
        localStorage.setItem('TableNumber', number)
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
      if (localStorage.getItem('Orders')) {
        Order = JSON.parse(localStorage.getItem('Orders'))
      }
      console.log('Order', Order)
      this.Orderitems = Order
    },
    checkout () {
      // console.log('Final Order', this.Orderitems)
      var FinalOrder = {
        KOTNO: this.KOTNumber,
        ItemsList: this.Orderitems
      }
      // console.log('Current Date:', this.getKOTDate())
      console.log('Final Order', JSON.stringify(FinalOrder))
      axios.addItemToActiveOrder(FinalOrder).then((data) => {
        if (data.status === 200) {
          localStorage.removeItem('Orders')
          this.$parent.Order = []
          this.snackbar2 = true
          setTimeout(function () {
            router.push({name: 'Setting'})
          }, 3000)
        }
      })
    },
    getKOTDate () {
      var today = new Date()
      var date = today.getDate()
      var month = today.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      (date < 10) ? date = '0' + date : date = today.getDate
      var year = today.getFullYear()
      var KOTDat = year + '-' + month + '-' + date
      return KOTDat
    },
    getKOTTime () {
      var today = new Date()
      var Hour = today.getHours()
      if (Hour < 10) {
        Hour = '0' + Hour
      }
      var Min = today.getMinutes()
      if (Min < 10) {
        Min = '0' + Min
      }
      var Sec = today.getSeconds()
      if (Sec < 10) {
        Sec = '0' + Sec
      }
      var KOTTime = Hour + ':' + Min + ':' + Sec
      return KOTTime
    },
    changeOrders () {
      if (this.activeOrder) {
        this.activeOrder = false
        this.newOrder = true
        return false
      }
      if (this.newOrder) {
        this.newOrder = false
        this.activeOrder = true
        return false
      }
    },
    fetchActiveOrderList () {
      axios.fetchActiveOrderList(localStorage.getItem('TableNumber')).then((data) => {
        localStorage.setItem('activeOrders', JSON.stringify(data.ItemsList))
        localStorage.setItem('WaiterId', data.WaiterId)
        localStorage.setItem('KOTNumber', data.KOTNO)
        this.KOTNumber = localStorage.getItem('KOTNumber')
        this.waiterId = localStorage.getItem('WaiterId')
        this.activeOrderItems = JSON.parse(localStorage.getItem('activeOrders'))
      })
    }
  }
}
</script>
<style>

</style>