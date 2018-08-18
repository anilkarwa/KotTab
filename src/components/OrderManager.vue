<template>
<div id="app">
  <v-app id="inspire">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12 sm4 md4 class="elevation-24">
          <v-card dark color="blue darken-3">
            <v-card-title><v-text-field
                v-model="searchFoodItem"
                flat
                solo-inverted
                prepend-icon="search"
                label="Search Food Item"
                @input="FilterFoodItem()"
            ></v-text-field></v-card-title>
          </v-card>
            <v-container class="itemContainer">
                <div class="itemList">
                    <v-list two-line :search="searchFoodItem">
                    <template v-for="(item, index) in foodItem">
                    <v-list-tile :key="item.title" avatar @click="foodItemSelection(item.ItemID,item.ItemName,item.ItemRate,item.KCATID)">
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
                <span style="font-size:25px;"> {{ displayTableNumber() }} </span>
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
                      <td class="text-xs-right">
                          <v-btn fab dark small color="red" @click="removeQuantity(props.item)"><v-icon dark>remove</v-icon></v-btn>
                          {{ props.item.KOTQuantity }}
                          <v-btn fab dark small color="green" @click="addQuantity(props.item)"><v-icon dark>add</v-icon></v-btn>
                      </td>
                      <td class="text-xs-right">{{ props.item.KOTRate }}</td>
                      <td class="text-xs-right">{{ props.item.KOTAmount }}</td>
                      <td class="justify-center layout px-0">
                        <v-btn icon class="mx-0"
                        @click="editOrderItem(props.item)"
                        >
                          <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0"
                        @click="deleteOrderItem(props.item)"
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
              <v-flex>
                      <!-- Total Quantity: {{vacantOrderQuantity}} || Total Amount: {{vacantOrderTotalAmount}} -->
              </v-flex>
            </v-container>
            <v-container v-else>
               
            </v-container>
        </v-flex>
      </v-layout>
    </v-container>
<!-- Model for Edit Order List Item -->
    <v-dialog v-model="editItemModel" max-width="500px">
        <v-card>
            <v-card-title>
              <span class="headline">Add Additional Instructions</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.ItemName" label="Item Name" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 align-end flexbox>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.KOTQuantity" label="Quantity" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.KOTRate" label="Rate" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.KOTAmount" label="Amount" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
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
              <v-btn color="blue darken-1" flat @click.native="editItemModel = false">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click.native="modifyOrderItem">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    <!-- <v-snackbar
      :timeout="3000"
      :top="'top'"
      :right="'right'"
      :color="snackbarcolor"
      v-model="snackbar"
    >
      {{ snackbarText }}
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar> -->
  </v-app>
</div>
</template>
<script>
// import router from '../router'
import axios from './Services/httpClient.js'
export default {
  data () {
    return {
      searchFoodItem: '',
      foodItem: [],
      vacantTable: true,
      paxData: [],
      paxId: null,
      waiterData: [],
      waiterId: null,
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
      newItem: {
        ItemId: 0,
        SlNo: 1,
        ItemName: '',
        KOTQuantity: 1,
        KOTRate: 1,
        KOTAmount: 1,
        KCATID: 0,
        AdditionalInstructions: ''
      },
      Orderitems: [],
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
      editItemModel: false
    }
  },
  beforeMount () {
    this.loadFoodItem()
    this.createPaxId()
    this.getWaiterList()
    this.loadOrderItem()
  },
  methods: {
    displayTableNumber () {
      return localStorage.getItem('TableName')
    },
    FilterFoodItem () {
      console.log('EVENT', this.searchFoodItem)
      const tableNumber = localStorage.getItem('TableNumber')
      if (this.searchFoodItem) {
        axios.getFilteredItemList(this.searchFoodItem, tableNumber).then((data) => {
          this.foodItem = data
        })
      } else {
        axios.getFoodItemList(tableNumber).then((data) => {
          this.foodItem = data
          console.log('Food Item', this.foodItem)
        })
      }
    },
    loadFoodItem () {
      const tableNumber = localStorage.getItem('TableNumber')
      axios.getFoodItemList(tableNumber).then((data) => {
        this.foodItem = data
      })
    },
    foodItemSelection (itemId, itemName, itemRate, itemKCATID) {
      console.log('Item Details', itemId, itemName, itemRate, itemKCATID)
      this.newItem.ItemId = itemId
      this.newItem.ItemName = itemName
      this.newItem.KOTRate = itemRate
      this.newItem.KOTAmount = this.newItem.KOTRate * this.newItem.KOTQuantity
      this.newItem.KCATID = itemKCATID
      this.addItemIncart()
    },
    createPaxId () {
      for (let a = 1; a <= 50; a++) {
        this.paxData.push({ paxSl: a })
      }
    },
    getWaiterList () {
      axios.getWaiterList().then((data) => {
        this.waiterData = data
      })
    },
    addItemIncart () {
      const self = this
      console.log('TTT', localStorage.getItem('Orders'))
      if (!localStorage.getItem('Orders')) {
        console.log('Yhai hai bhai vo')
        localStorage.setItem('Orders', JSON.stringify(this.$parent.Order))
      }
      if (self.newItem.ItemId && self.newItem.SlNo && self.newItem.ItemName && self.newItem.KOTQuantity > 0 && self.newItem.KOTRate > 0 && self.newItem.KOTAmount === self.newItem.KOTQuantity * self.newItem.KOTRate) {
        console.log('Coming')
        const preOrderItem = {
          ItemId: self.newItem.ItemId,
          ItemName: self.newItem.ItemName,
          SlNo: self.newItem.SlNo,
          KOTQuantity: self.newItem.KOTQuantity,
          KOTRate: self.newItem.KOTRate,
          KOTAmount: self.newItem.KOTAmount,
          KCATID: self.newItem.KCATID,
          AdditionalInstructions: self.newItem.AdditionalInstructions
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
        // this.vacantOrderQuantity = this.$parent.Order.length
        // this.vacantOrderTotalAmount = this.vacantOrderTotalAmount + preOrderItem.KOTAmount
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
          console.log('this.vacantOrderTotalAmount', this.vacantOrderTotalAmount)
          console.log('data.KOTAmount', data.KOTAmount)
          console.log('After Adding', this.vacantOrderTotalAmount)
          orderSl++
        })
        localStorage.setItem('Orders', JSON.stringify(this.$parent.Order))
        console.log('Local Storage', JSON.parse(localStorage.getItem('Orders')))
        self.newItem.AdditionalInstructions = ''
        this.newItem.KOTQuantity = 1
        // this.snackbarcolor = 'success'
        // this.snackbarText = 'Successfully Added Into Cart'
        // this.snackbar = true
        // this.dialog = false
      }
      this.loadOrderItem()
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
    addQuantity (item) {
      this.editedIndex = this.Orderitems.indexOf(item)
      console.log('Item in addQuantity', item)
      this.editedItem.AdditionalInstructions = item.AdditionalInstructions
      this.editedItem.ItemId = item.ItemId
      this.editedItem.ItemName = item.ItemName
      this.editedItem.KCATID = item.KCATID
      console.log('Before Quantity', item.KOTQuantity)
      this.editedItem.KOTQuantity = item.KOTQuantity + 1
      console.log('After Quantity', this.editedItem.KOTQuantity)
      console.log('Before Rate', item.KOTRate)
      this.editedItem.KOTRate = item.KOTRate
      console.log('After Rate', this.editedItem.KOTRate)
      this.editedItem.KOTAmount = this.editedItem.KOTQuantity * this.editedItem.KOTRate
      this.editedItem.SlNo = item.SlNo
      if (this.editedIndex > -1) {
        Object.assign(this.Orderitems[this.editedIndex], this.editedItem)
      }
      localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
    },
    removeQuantity (item) {
      if (item.KOTQuantity > 1) {
        this.editedIndex = this.Orderitems.indexOf(item)
        console.log('Item in addQuantity', item)
        this.editedItem.AdditionalInstructions = item.AdditionalInstructions
        this.editedItem.ItemId = item.ItemId
        this.editedItem.ItemName = item.ItemName
        this.editedItem.KCATID = item.KCATID
        console.log('Before Quantity', item.KOTQuantity)
        this.editedItem.KOTQuantity = item.KOTQuantity - 1
        console.log('After Quantity', this.editedItem.KOTQuantity)
        console.log('Before Rate', item.KOTRate)
        this.editedItem.KOTRate = item.KOTRate
        console.log('After Rate', this.editedItem.KOTRate)
        this.editedItem.KOTAmount = this.editedItem.KOTQuantity * this.editedItem.KOTRate
        this.editedItem.SlNo = item.SlNo
        if (this.editedIndex > -1) {
          Object.assign(this.Orderitems[this.editedIndex], this.editedItem)
        }
        localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
      }
    },
    editOrderItem (item) {
      console.log('ITEM', item)
      this.editedIndex = this.Orderitems.indexOf(item)
      this.editedItem.AdditionalInstructions = item.AdditionalInstructions
      this.editedItem.ItemId = item.ItemId
      this.editedItem.ItemName = item.ItemName
      this.editedItem.KCATID = item.KCATID
      this.editedItem.KOTQuantity = item.KOTQuantity
      this.editedItem.KOTRate = item.KOTRate
      this.editedItem.KOTAmount = this.editedItem.KOTQuantity * this.editedItem.KOTRate
      this.editedItem.SlNo = item.SlNo
      this.editItemModel = true
    },
    modifyOrderItem () {
      if (this.editedIndex > -1) {
        Object.assign(this.Orderitems[this.editedIndex], this.editedItem)
      }
      localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
      this.editItemModel = false
    },
    deleteOrderItem (item) {
      const index = this.Orderitems.indexOf(item)
      //   this.vacantOrderTotalAmount = this.vacantOrderTotalAmount - this.Orderitems[index].KOTAmount
      this.Orderitems.splice(index, 1)
      localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
      this.loadOrderItem()
      //   this.DeleteItemdialog = false
      //   this.vacantOrderQuantity = this.Orderitems.length
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
