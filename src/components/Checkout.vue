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
                      <td class="justify-center layout px-0">
                        <v-btn icon class="mx-0"
                        @click="editOrderItem(props.item)"
                        >
                          <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0"
                        @click="confirmDialog(props.item)"
                        >
                          <v-icon color="pink">delete</v-icon>
                        </v-btn>
                      </td>
                    </template>
                    <template slot="no-data">
                      <!-- <v-btn color="primary">Reset</v-btn> -->
                      <p>No Order Available for This Table</p>
                    </template>
                  </v-data-table>
              </v-layout>
              <!-- <v-layout row justify-center>
                <v-btn color="success" dark large @click="checkout()">Place the Order</v-btn>
              </v-layout> -->
              <!-- <v-layout row justify-center>
                <v-btn color="success" dark large @click="sendForPayment">Send for Payment</v-btn>
              </v-layout> -->
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
        :top="y2 === 'top'"
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
    <v-dialog v-model="editItem" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit Item</span>
            </v-card-title>
  
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.ItemName" label="Item Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12 align-end flexbox>
                  <span style="font-size:25px;margin-right:1%">Quntity:</span>
                  <v-btn fab dark small color="red" @click="ModifyOrder('remove')"><v-icon dark>remove</v-icon></v-btn>
                  <span style="font-size:20px;color:red">{{ editedItem.KOTQuantity }}</span>
                  <v-btn fab dark small color="green" @click="ModifyOrder('add')"><v-icon dark>add</v-icon></v-btn>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.KOTQuantity" label="Quantity"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.KOTRate" label="Rate" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.KOTAmount" label="Amount" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="editedItem.AdditionalInstructions"
                      rows="1"
                      multi-line>
                      <div slot="label">
                      Additional Instructions
                    </div>
              </v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="editItem = false">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click.native="saveOrderItem">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Delete Item Dialog Box -->
        <v-dialog
        v-model="DeleteItemdialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">Are you Sure you wanna Delete this Item ?</v-card-title>
  
          <v-card-text>
            Are you Sure you wanna Delete this Item, If Yes please click on Agree button on the right side
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="dialog = false"
            >
              Disagree
            </v-btn>
  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="deleteOrderItem()"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-app>
</div>
</template>
<script>
import axios from './Services/httpClient.js'
import router from '../router'
export default {
  data () {
    return {
      DeleteItemdialog: false,
      editItem: false,
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
        { text: 'Amount', value: 'Amount' },
        { text: 'Action', value: 'Action' }
      ],
      editedItem: {
        AdditionalInstructions: '',
        ItemId: '',
        ItemName: '',
        KCATID: '',
        KOTAmount: '',
        KOTQuantity: '',
        KOTRate: '',
        SlNo: ''
      },
      Orderitems: [],
      snackbar: false,
      snackbar2: false,
      y: 'top',
      y2: '',
      x: null,
      mode: '',
      timeout: 3000,
      timeout2: 6000,
      text: 'Please Select the WaiterID',
      snackbar2text: '',
      snackbar2color: 'success',
      editedIndex: -1,
      deleteItem: ''
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
      console.log('TYPE of', typeof (this.Orderitems))
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
        // console.log('Final Order', JSON.stringify(FinalOrder))
        console.log('Final Order', FinalOrder)

        // Test Code for printer Code ---- Start HERE ------
        const orderListForPrinter = FinalOrder.ItemsList
        console.log('Priner Order Data', orderListForPrinter)
        var KcatIdTable = []
        var finalOrderList = []

        orderListForPrinter.forEach(element => {
          if (KcatIdTable.includes(element.KCATID)) {
            let key
            for (let i = 0; i < finalOrderList.length; i++) {
              if (finalOrderList[i][element.KCATID] !== undefined) {
                key = i
              }
            }
            finalOrderList[key][element.KCATID].push(element)
          } else {
            KcatIdTable.push(element.KCATID)
            let temp = {
              [element.KCATID]: [element]
            }
            finalOrderList.push(temp)
          }
        })
        finalOrderList.forEach(order => {
          const payload = {
            printerAddress: Object.keys(order)[0],
            printData: order[Object.keys(order)]
          }
          axios.printOrders(payload).then(response => {
            console.log('Response for printing data', response)
          })
        })
        // Test Code for printer Code ---- End HERE ------

        axios.placeOrder(FinalOrder).then((data) => {
          if (data.status === 200) {
            axios.updateTableStatus(localStorage.getItem('TableNumber')).then((response) => {
              console.log('Changin table status', response)
            })
            // Code for Print the order Start here
            const orderListForPrinter = FinalOrder.ItemsList
            let KcatIdTable = []
            let finalOrderList = []
            orderListForPrinter.forEach(element => {
              if (KcatIdTable.includes(element.KCATID)) {
                let key
                for (let i = 0; i < finalOrderList.length; i++) {
                  if (finalOrderList[i][element.KCATID] !== undefined) {
                    key = i
                  }
                }
                finalOrderList[key][element.KCATID].push(element)
              } else {
                KcatIdTable.push(element.KCATID)
                let temp = {
                  [element.KCATID]: [element]
                }
                finalOrderList.push(temp)
              }
            })
            finalOrderList.forEach(order => {
              const payload = {
                printerAddress: Object.keys(order)[0],
                printData: order[Object.keys(order)]
              }
              console.log('Payload', payload)
              axios.printOrders(payload).then(response => {
                console.log('Response for printing data', response)
              })
            })
            // Code for Print the order End here
            localStorage.removeItem('Orders')
            this.$parent.Order = []
            this.y2 = 'bottom'
            this.snackbar2text = 'Order placed Successfully'
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
    },
    sendForPayment () {
      axios.sendForPayment(localStorage.getItem('TableNumber')).then((data) => {
        if (data.status === 200) {
          this.y2 = 'top'
          this.snackbar2text = 'Successfully send for payment'
          this.snackbar2 = true
          setTimeout(function () {
            router.push({name: 'Setting'})
          }, 3000)
        }
      })
    },
    editOrderItem (item) {
      console.log('ITEM', item)
      this.editedIndex = this.Orderitems.indexOf(item)
      console.log('Edit 1', this.Orderitems.indexOf(item))
      this.editedItem = Object.assign({}, item)
      console.log('Edit 2', this.editedItem)
      this.editItem = true
    },
    saveOrderItem () {
      console.log('coming')
      if (this.editedIndex > -1) {
        Object.assign(this.Orderitems[this.editedIndex], this.editedItem)
      } else {
        this.Orderitems.push(this.editedItem)
      }
      // localStorage.setItem('Orders', [])
      localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
      this.editItem = false
    },
    deleteOrderItem () {
      const index = this.Orderitems.indexOf(this.deleteItem)
      this.Orderitems.splice(index, 1)
      localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
      this.DeleteItemdialog = false
    },
    confirmDialog (item) {
      this.deleteItem = item
      this.DeleteItemdialog = true
    },
    ModifyOrder (item) {
      console.log('Modify Item', item)
      if (item === 'add') {
        console.log('Coming in add')
        this.editedItem.KOTQuantity = parseInt(this.editedItem.KOTQuantity, 10) + 1
        this.editedItem.KOTAmount = this.editedItem.KOTRate * this.editedItem.KOTQuantity
      } else {
        console.log('Coming in remove')
        if (this.editedItem.KOTQuantity > 1) {
          this.editedItem.KOTQuantity = this.editedItem.KOTQuantity - 1
          this.editedItem.KOTAmount = this.editedItem.KOTRate * this.editedItem.KOTQuantity
        }
      }
      if (this.editedIndex > -1) {
        Object.assign(this.Orderitems[this.editedIndex], this.editedItem)
      }
      localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
    }
  }
}
</script>
<style>

</style>