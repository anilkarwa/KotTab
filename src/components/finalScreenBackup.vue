<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-layout row>
        <v-flex xs8 order-lg2 class="elevation-24">
            <v-layout row>
                <v-flex xs12 class="text-md-center">
                <v-card dark tile flat color="blue darken-3">
                    <v-card-text><span style="font-size:25px;margin-right:1%">Table Number:</span></v-card-text>
                </v-card>
                </v-flex>
            </v-layout>
            <v-layout row justify-space-around>
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
                <v-flex xs3 class="text-md-center">
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
        </v-flex>
        <v-flex xs4 class="elevation-24 itemContainer" style="margin-right:0.5%">
            <v-flex class="searchBox">
                <v-card dark tile flat color="blue darken-3">
                <v-card-text>
                <v-text-field
                v-model="search"
                flat
                solo-inverted
                prepend-icon="search"
                label="Search Food Item"
                @input="foodFilter()"
            ></v-text-field>
                </v-card-text>
                </v-card>
            </v-flex>
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
        </v-flex>
      </v-layout>
    </v-container>
    <!-- Model for Add and Edit Item -->
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
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
  </v-app>
</template>
<script>
import router from '../router'
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
      foodItem: [],
      timeout: 2000,
      y: 'bottom',
      mode: '',
      snackbarcolor: 'success',
      snackbar: false,
      snackbartext: 'Item Added Successfully'
    }
  },
  beforeMount () {
    this.getWaiterList()
    this.loadFoodItem()
    this.createPaxId()
    this.loadOrderItem()
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
        localStorage.setItem('Orders', JSON.stringify(this.$parent.Order))
        console.log('Local Storage', JSON.parse(localStorage.getItem('Orders')))
        self.items.AdditionalInstructions = ''
        this.items.KOTQuantity = 1
        this.snackbar = true
        this.dialog = false
      }
      this.loadOrderItem()
    },
    checkout () {
      console.log('COming inside')
      if (localStorage.getItem('pointingTable') === 'VacantTables') {
        router.push({name: 'Checkout'})
      }
      if (localStorage.getItem('pointingTable') === 'OccupiedTables') {
        router.push({name: 'ActiveOrder'})
      }
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
    }
  }
}
</script>
<style>
.itemContainer {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.searchBox {
  height: 15%;
  flex-shrink: 0;
}
.itemList {
  flex-grow: 1;
  overflow-x: auto;
}
</style>

