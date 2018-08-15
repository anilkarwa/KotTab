<template>
<div id="app">
  <v-app id="inspire">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12 sm4 md4 class="elevation-24">
          <v-card dark color="blue darken-3">
            <v-card-title><v-text-field
                v-model="search"
                flat
                solo-inverted
                prepend-icon="search"
                label="Search Food Item"
                @input="foodFilter()"
            ></v-text-field></v-card-title>
          </v-card>
            <v-container class="itemContainer">
                <div class="itemList">
                    <v-list two-line :search="search">
                    <template v-for="(item, index) in foodItem">
                    <v-list-tile :key="item.title" avatar @click="itemSelection(item.ItemID,item.ItemName,item.ItemRate,item.KCATID)">
                        <v-list-tile-avatar>
                        <img src="./../assets/dinner.svg" >
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                        <v-list-tile-title v-html="item.ItemDispName"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="item.ItemDesc"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider :key="index"></v-divider>
                    </template>
                    </v-list>
                </div>
            </v-container>
        </v-flex>
        <v-flex xs12 sm7 md7 class="elevation-23 ml-3">
          <v-card dark color="blue darken-3">
            <v-card-text>
                <span style="font-size:25px;margin-right:1%">Table Number:</span>
                <span style="font-size:25px;"> {{ displayTableNumber($route.params.tableName,$route.params.tableNumber) }} </span>
            </v-card-text>
          </v-card>
            <v-container v-if="vacantTable">
                <v-layout row justify-space-around >
                    <v-flex xs3 class="text-md-center">
                        <v-select
                            :items="paxData"
                            v-model="paxId"
                            label="Select Pax"
                            single-line
                            item-text="paxSl"
                            item-value="paxSl"
                            autocomplete
                        ></v-select>
                    </v-flex>
                    <v-flex xs3 class="text-md-center" v-if="!occupiedTable">
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
                <v-flex v-if="occupiedTable">
                  <h2>Add Item</h2>
                  <v-btn outline color="indigo" @click.native="vacantTable = false">Show Active Order</v-btn>
                </v-flex>
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
               <div class="text-xs-center">
                  <v-btn round color="success" @click="checkout()" dark v-if="!occupiedTable">Place Kitchen Order</v-btn>
                  <v-btn round color="success" @click="activeOrderCheckout()" dark v-if="occupiedTable">Add Items in Kitchen Order</v-btn>
               </div>
            </v-container>
            <v-container v-else>
                <v-flex>
                  <h2>Active Order</h2>
                  <v-btn outline color="indigo" @click.native="vacantTable = true">Add/Show New Order</v-btn>
                </v-flex>
                <v-layout row justify-center>
                 <v-data-table
                  :headers="activeOrderHeaders"
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
                      <p>No Active Order Available for This Table</p>
                    </template>
                  </v-data-table>
              </v-layout>
               <div class="text-xs-center">
                  <v-btn round color="success" @click="sendForPayment()" dark>Send For payment</v-btn>
               </div>
            </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- Model for Add and Edit Item -->
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Add New Item</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Item Name" v-model="items.ItemName" required disabled></v-text-field>
                </v-flex>
                <v-flex xs12 align-end flexbox>
                  <span style="font-size:25px;margin-right:1%">Quntity:</span>
                  <v-btn fab dark small color="red" @click="removeOrder()"><v-icon dark>remove</v-icon></v-btn>
                  <span style="font-size:20px;color:red">{{ items.KOTQuantity }}</span>
                  <v-btn fab dark small color="green" @click="addOrder()"><v-icon dark>add</v-icon></v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                  v-model="items.KOTRate"
                  label="Rate"
                  @input="calculateAmount()" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 align-end flexbox>
                <v-text-field
                v-model="items.AdditionalInstructions"
                    color="teal"
                    rows="2"
                    multi-line>
                    <div slot="label">
                    Additional Note: <small>(optional)</small>
                    </div>
                </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="addItemIncart()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        <!-- Model for Edit Order List Item -->
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
        <v-dialog v-model="DeleteItemdialog" max-width="290">
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
              @click="DeleteItemdialog = false"
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
      <v-snackbar
        :timeout="3000"
        :top="'top'"
        :right="'right'"
        :color="snackbarcolor"
        v-model="snackbar"
        >
        {{ snackbarText }}
        <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
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
      vacantTable: false,
      occupiedTable: false,
      dialog: false,
      editItem: false,
      DeleteItemdialog: false,
      drawer: null,
      search: '',
      notifications: false,
      sound: true,
      widgets: false,
      items: {
        ItemId: '',
        SlNo: '',
        ItemName: '',
        KOTQuantity: 1,
        KOTRate: 0,
        KOTAmount: 0,
        KCATID: '',
        AdditionalInstructions: ''
      },
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
      waiterData: [],
      paxData: [],
      waiterId: null,
      paxId: null,
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
      activeOrderHeaders: [
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
      foodItem: [],
      snackbarcolor: '',
      snackbar: false,
      snackbarText: '',
      deleteItem: '',
      activeOrderItems: []
    }
  },
  beforeMount () {
    this.checkTheTable()
    this.loadFoodItem()
    this.createPaxId()
    this.loadOrderItem()
    this.getWaiterList()
    if (this.occupiedTable) {
      this.fetchActiveOrderList()
    }
  },
  methods: {
    displayTableNumber (name, number) {
      console.log('Display Table Number')
      if (!(name === undefined)) {
        localStorage.setItem('TableName', name)
      }
      if (!(number === undefined)) {
        localStorage.setItem('TableNumber', number)
      }
      return localStorage.getItem('TableName')
    },
    checkTheTable () {
      console.log('COming inside')
      if (localStorage.getItem('pointingTable') === 'VacantTables') {
        console.log('Enabling the Vacant Tables')
        this.vacantTable = true
      }
      if (localStorage.getItem('pointingTable') === 'OccupiedTables') {
        console.log('Enabling the Occupied Tables')
        this.occupiedTable = true
      }
    },
    loadFoodItem () {
      axios.getFoodItemList().then((data) => {
        this.foodItem = data
        console.log('Food Item', this.foodItem)
      })
    },
    foodFilter () {
      console.log('EVENT', this.search)
      if (this.search) {
        axios.getFilteredItemList(this.search).then((data) => {
          this.foodItem = data
        })
      } else {
        axios.getFoodItemList().then((data) => {
          this.foodItem = data
          console.log('Food Item', this.foodItem)
        })
      }
    },
    itemSelection (id, name, rate, counterId) {
      const self = this
      self.items.ItemId = id
      self.items.SlNo = id
      self.items.ItemName = name
      // self.items.KOTQuantity = id
      self.items.KOTRate = rate
      self.items.KOTAmount = self.items.KOTQuantity * self.items.KOTRate
      self.items.KCATID = counterId
      // self.items.AdditionalInstructions = id
      console.log('ID', id)
      console.log('Name', name)
      this.dialog = true
    },
    addOrder () {
      if (this.items.KOTQuantity >= 1) {
        this.items.KOTQuantity = this.items.KOTQuantity + 1
      }
      this.items.KOTAmount = this.items.KOTQuantity * this.items.KOTRate
    },
    removeOrder () {
      if (this.items.KOTQuantity > 1) {
        this.items.KOTQuantity = this.items.KOTQuantity - 1
      }
      this.items.KOTAmount = this.items.KOTQuantity * this.items.KOTRate
    },
    calculateAmount () {
      this.items.KOTAmount = this.items.KOTQuantity * this.items.KOTRate
    },
    addItemIncart () {
      const self = this
      console.log('TTT', localStorage.getItem('Orders'))
      if (!localStorage.getItem('Orders')) {
        console.log('Yhai hai bhai vo')
        localStorage.setItem('Orders', JSON.stringify(this.$parent.Order))
      }
      if (self.items.ItemId && self.items.SlNo && self.items.ItemName && self.items.KOTQuantity > 0 && self.items.KOTRate > 0 && self.items.KOTAmount === self.items.KOTQuantity * self.items.KOTRate) {
        console.log('Coming')
        const preOrderItem = {
          ItemId: self.items.ItemId,
          ItemName: self.items.ItemName,
          SlNo: self.items.SlNo,
          KOTQuantity: self.items.KOTQuantity,
          KOTRate: self.items.KOTRate,
          KOTAmount: self.items.KOTAmount,
          KCATID: self.items.KCATID,
          AdditionalInstructions: self.items.AdditionalInstructions
        }
        console.log('Test 1', localStorage.getItem('Orders'))
        if (this.$parent.Order.length === 0) {
          console.log('YOOO')
          this.$parent.Order = JSON.parse(localStorage.getItem('Orders'))
          this.$parent.Order.push(preOrderItem)
        } else {
          console.log('ELSEEE')
          console.log('Local Store Value', JSON.parse(localStorage.getItem('Orders')))
          this.$parent.Order.push(preOrderItem)
        }
        let orderSl = 1
        if (this.occupiedTable) {
          let activeOrderQuantity = JSON.parse(localStorage.getItem('activeOrders')).length
          if (activeOrderQuantity > 0) {
            console.log('Current Table Order Item List Length', activeOrderQuantity)
            orderSl = activeOrderQuantity + 1
          }
        }
        this.$parent.Order.forEach(data => {
          console.log('Reorder the Order Loop', data.SlNo)
          data.SlNo = orderSl
          orderSl++
        })
        localStorage.setItem('Orders', JSON.stringify(this.$parent.Order))
        console.log('Local Storage', JSON.parse(localStorage.getItem('Orders')))
        self.items.AdditionalInstructions = ''
        this.items.KOTQuantity = 1
        this.snackbarcolor = 'success'
        this.snackbarText = 'Successfully Added Into Cart'
        this.snackbar = true
        this.dialog = false
      }
      this.loadOrderItem()
    },
    getWaiterList () {
      axios.getWaiterList().then((data) => {
        console.log('Waiter Data', data)
        this.waiterData = data
      })
      console.log('Waiter Data--', this.waiterData)
    },
    createPaxId () {
      for (let a = 1; a <= 50; a++) {
        this.paxData.push({ paxSl: a })
      }
      console.log('Pax', this.paxData)
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
    editOrderItem (item) {
      console.log('ITEM', item)
      this.editedIndex = this.Orderitems.indexOf(item)
      console.log('Edit 1', this.Orderitems.indexOf(item))
      this.editedItem = Object.assign({}, item)
      console.log('Edit 2', this.editedItem)
      this.editItem = true
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
    },
    confirmDialog (item) {
      this.deleteItem = item
      this.DeleteItemdialog = true
    },
    deleteOrderItem () {
      const index = this.Orderitems.indexOf(this.deleteItem)
      this.Orderitems.splice(index, 1)
      localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
      this.loadOrderItem()
      this.DeleteItemdialog = false
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
    checkout () {
      console.log('Coming inside')
      /**
       * if conditon for checking if waiterId is there or not waiter Id is not there it will show the pop-up
       * else if conditon for checking if PaxId is there or not if waxId is not there it will show the pop-up
       * else if condition will run all API calls regarding Kitchen Order
       */
      console.log('Waiter id', this.waiterId)
      console.log('Waiter id', this.paxId)
      if (!this.paxId) {
        this.snackbarcolor = 'error'
        this.snackbarText = 'Please Select the PAX Number'
        this.snackbar = true
      } else if (!this.waiterId || this.waiterId <= 0) {
        this.snackbarcolor = 'error'
        this.snackbarText = 'Please Select the Waiter Id'
        this.snackbar = true
      } else if (this.waiterId && this.paxId) {
        /**
         * Final Order Body for API
         */
        var FinalOrder = {
          TableId: localStorage.getItem('TableNumber'),
          WaiterId: this.waiterId,
          PAX: this.paxId,
          AddedBy: 'User 1',
          KOTDate: this.getKOTDate(),
          TimeOfKOT: this.getKOTTime(),
          AddedDateTime: this.getKOTDate() + ' ' + this.getKOTTime(),
          ItemsList: this.Orderitems
        }
        console.log('Final Order', FinalOrder)
        /**
         * Prepare Order list for Printing
         */
        const orderListForPrinter = FinalOrder.ItemsList
        console.log('Priner Order Data', orderListForPrinter)
        /**
         * Place The Order #send request to server
         */
        axios.placeOrder(FinalOrder).then((data) => {
          if (data.status === 200) {
            console.log('response on final order placing', data)
            axios.updateTableStatus(localStorage.getItem('TableNumber')).then((response) => {
              console.log('Changin table status', response)
            })
            /**
              * Code for Splitting the order according to the counter ID
              */
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
                waiterId: this.waiterId,
                tableNumber: localStorage.getItem('TableNumber'),
                kotNumber: '',
                PAX: this.paxId,
                printData: order[Object.keys(order)]
              }
              console.log('Payload for printer', payload)
              axios.printOrders(payload).then(response => {
                console.log('Response for printing data', response)
              }).catch(error => {
                console.log('Error While Printing the data', error)
              })
            })
            // Code for Print the order End here
            localStorage.removeItem('Orders')
            this.$parent.Order = []
            this.snackbarcolor = 'success'
            this.snackbarText = 'Order placed Successfully'
            this.snackbar = true
            setTimeout(function () {
              router.push({name: 'Setting'})
            }, 3000)
          }
        })
      }
    },
    activeOrderCheckout () {
      var FinalOrder = {
        KOTNO: this.KOTNumber,
        ItemsList: this.Orderitems
      }
      console.log('Final Order', JSON.stringify(FinalOrder))
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
          waiterId: this.waiterId,
          tableNumber: localStorage.getItem('TableNumber'),
          kotNumber: '',
          PAX: this.paxId,
          printerAddress: Object.keys(order)[0],
          printData: order[Object.keys(order)]
        }
        axios.printOrders(payload).then(response => {
          console.log('Response for printing data', response)
        })
      })
      // Test Code for printer Code ---- End HERE ------

      axios.addItemToActiveOrder(FinalOrder).then((data) => {
        if (data.status === 200) {
          localStorage.removeItem('Orders')
          this.$parent.Order = []
          this.y = 'bottom'
          this.snackbar2text = 'Order placed Successfully'
          this.snackbar2 = true
          setTimeout(function () {
            router.push({name: 'Setting'})
          }, 3000)
        }
      })
    },
    fetchActiveOrderList () {
      axios.fetchActiveOrderList(localStorage.getItem('TableNumber')).then((data) => {
        console.log('Fetch Active order', data)
        localStorage.setItem('activeOrders', JSON.stringify(data.ItemsList))
        localStorage.setItem('WaiterId', data.WaiterId)
        localStorage.setItem('KOTNumber', data.KOTNO)
        this.KOTNumber = localStorage.getItem('KOTNumber')
        this.waiterId = localStorage.getItem('WaiterId')
        this.activeOrderItems = JSON.parse(localStorage.getItem('activeOrders'))
        console.log('Waiter Id', this.waiterId)
      })
    },
    sendForPayment () {
      axios.sendForPayment(localStorage.getItem('TableNumber')).then((data) => {
        if (data.status === 200) {
          this.y = 'top'
          this.snackbar2text = 'Successfully send for payment'
          this.snackbar2 = true
          setTimeout(function () {
            router.push({name: 'Setting'})
          }, 3000)
        }
      })
    }
  }
}
</script>
<style scoped>
.itemContainer {
  /* width: 100vw; */
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.itemList {
  flex-grow: 1;
  overflow-x: auto;
}
</style>
