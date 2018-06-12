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
                    <span style="font-size:25px;color:red"> {{ displayTableNumber($route.params.tableName) }} </span>
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
                  <router-link to="/menu">
                    <v-btn depressed color="info">Add Items</v-btn>
                  </router-link>
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
           <v-snackbar
        :timeout="timeout"
        :top="y === 'top'"
        :vertical="mode === 'vertical'"
        v-model="snackbar"
      >
        {{ text }}
        <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>

        <v-snackbar
        :timeout="timeout2"
        :bottom="y2 === 'bottom'"
        :vertical="mode === 'multi-line'"
        :color="snackbar2color"
        v-model="snackbar2">
        {{ snackbar2text }}
        <v-btn flat color="black" @click.native="snackbar2 = false">Close</v-btn>
      </v-snackbar>
        </v-card>
      </v-flex>
    </v-content>
  </v-app>
</div>
</template>
<script>
import axios from './Services/httpClient.js'
import router from '../router'
export default {
  data () {
    return {
      drawer: null,
      waiterId: null,
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
        { text: 'Quantity', value: 'Quantity' },
        { text: 'Rate', value: 'Rate' },
        { text: 'Amount', value: 'Amount' }
      ],
      Orderitems: [],
      snackbar: false,
      snackbar2: false,
      y: 'top',
      y2: 'bottom',
      x: null,
      mode: '',
      timeout: 3000,
      timeout2: 6000,
      text: 'Please Select the WaiterID',
      snackbar2text: 'Order placed Successfully',
      snackbar2color: 'success'
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
      if (localStorage.getItem('Orders')) {
        Order = JSON.parse(localStorage.getItem('Orders'))
      }
      console.log('Order', Order)
      this.Orderitems = Order
    },
    checkout () {
      if (this.waiterId) {
        var FinalOrder = {
          TableId: localStorage.getItem('TableNumber'),
          WaiterId: this.waiterId,
          AddedBy: 'User 1',
          KOTDate: this.getKOTDate(),
          TimeOfKOT: this.getKOTTime(),
          AddedDateTime: this.getKOTDate() + ' ' + this.getKOTTime(),
          ItemsList: this.Orderitems
        }
        // console.log('Current Date:', this.getKOTDate())
        console.log('Final Order', JSON.stringify(FinalOrder))
        axios.placeOrder(FinalOrder).then((data) => {
          if (data.status === 200) {
            axios.updateTableStatus(localStorage.getItem('TableNumber')).then((response) => {
              console.log('Changin table status', response)
            })
            localStorage.removeItem('Orders')
            this.$parent.Order = []
            this.snackbar2 = true
            setTimeout(function () {
              router.push({name: 'Setting'})
            }, 3000)
          }
        })
      } else {
        this.snackbar = true
      }
      // console.log('Final Order', this.Orderitems)
    },
    getKOTDate () {
      var today = new Date()
      var date = today.getDate()
      var month = today.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      (date < 10) ? date = '0' + date : date = today.getDate()
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
    }
  }
}
</script>
<style>

</style>