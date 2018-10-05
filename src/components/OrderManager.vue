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
                autofocus
                prepend-icon="search"
                label="Search Food Item"
                @input="FilterFoodItem()"
            ></v-text-field>
            </v-card-title>
            <v-card-title>
              <v-select
                  :items="itemCategoryList"
                  v-model="categoryId"
                  label="Select Item Category"
                  single-line
                  item-text="ItemMenuGroupCode"
                  item-value="ItemMenuGroupID"
                  autocomplete
                  @input="fetchItemByCategoryId()"
              ></v-select>
            </v-card-title>
          </v-card>
            <v-container class="itemContainer">
                <div class="itemList">
                    <v-list two-line :search="searchFoodItem">
                    <template v-for="(item, index) in foodItem">
                    <v-list-tile :key="item.title" avatar @click="foodItemSelection(item.ItemID,item.ItemName,item.ItemRate,item.KCATID)">
                        <!-- <v-list-tile-avatar>
                        <img src="./../assets/dinner.svg" >
                        </v-list-tile-avatar> -->
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
          <v-btn color="info" @click="home()">Home</v-btn>
            <v-container v-if="vacantTable">
                <v-layout row justify-space-around >
                    <v-flex xs3 class="text-md-center">
                      <v-chip label outline color="blue">Pax Number:</v-chip>
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
                      <v-chip label outline color="blue">Waiter Name:</v-chip>
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
                      <td> {{ props.item.ItemName }} <br/>
                        <span style="font-size: 90%;color:red" v-if="props.item.AdditionalInstructions">
                         {{props.item.AdditionalInstructions}}
                        </span>
                      </td>
                      <td style="padding: 0 4px !important;">
                          <v-btn fab dark small color="red" @click="removeQuantity(props.item)" style="width: 20px;height: 20px;"><v-icon dark>remove</v-icon></v-btn>
                          {{ props.item.KOTQuantity }}
                          <v-btn fab dark small color="green" @click="addQuantity(props.item)" style="width: 20px;height: 20px;"><v-icon dark>add</v-icon></v-btn>
                      </td>
                      <td class="text-xs-right">{{ props.item.KOTRate }}</td>
                      <!-- <td class="text-xs-right">{{ props.item.KOTAmount }}</td> -->
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
                      Total Quantity: {{vacantOrderQuantity}} || Total Amount: {{vacantOrderTotalAmount}}
              </v-flex>
                <div class="text-xs-center">
                  <v-btn round color="success" @click="checkoutOrderInVacantTable()" dark>Place Kitchen Order</v-btn>
               </div>
            </v-container>
            <v-container v-if="occupiedTable">
              <v-layout row justify-center style="margin-top:1%">
                 <v-data-table
                  :headers="headers"
                  :items="Orderitems"
                  hide-actions
                  class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.ItemName }} <br/>
                        <span style="font-size: 90%;color:red" v-if="props.item.AdditionalInstructions">
                         {{props.item.AdditionalInstructions}}
                        </span>
                      </td>
                      <td style="padding: 0 4px !important;">
                            <v-btn fab dark small color="red" @click="removeQuantity(props.item)" style="width: 20px;height: 20px;"><v-icon dark>remove</v-icon></v-btn>
                          {{ props.item.KOTQuantity }}
                          <v-btn fab dark small color="green" @click="addQuantity(props.item)" style="width: 20px;height: 20px;"><v-icon dark>add</v-icon></v-btn>
                      </td>
                      <td class="text-xs-center">{{ props.item.KOTRate }}</td>
                      <!-- <td class="text-xs-right">{{ props.item.KOTAmount }}</td> -->
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
                      Total Quantity: {{vacantOrderQuantity}} || Total Amount: {{vacantOrderTotalAmount}}
              </v-flex>
                <div class="text-xs-center">
                  <v-btn round color="success" @click="checkoutOrderInVacantTable()" dark>Place Kitchen Order</v-btn>
               </div>
               <v-layout row>
                 <v-spacer></v-spacer>
                 <v-btn color="info" @click="TransferTableFun()">Transfer Table</v-btn> 
                <v-spacer></v-spacer>
               <v-btn color="info" @click="mergeTableFun()">Merge Tables</v-btn>
               <v-spacer></v-spacer>
               <v-btn color="info" @click="rePrintOrder()">Re-Print</v-btn>
               <v-spacer></v-spacer>
               </v-layout>
                              <v-layout row justify-center style="margin-top:1%">
                   <v-data-table
                  :headers="activeOrderHeaders"
                  :items="activeOrderitems"
                  hide-actions
                  class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.ItemName }}<br/>
                        <span style="font-size: 90%;color:red" v-if="props.item.AdditionalInstructions">
                         {{props.item.AdditionalInstructions}}
                        </span>
                      </td>
                      <td class="text-xs-right">{{ props.item.KOTQuantity }}</td>
                      <td class="text-xs-right">{{ props.item.KOTRate }}</td>
                      <!-- <td class="text-xs-right">{{ props.item.KOTAmount }}</td> -->
                      <td class="justify-center layout px-0">
                        <v-btn icon class="mx-0" @click="modifyActiveOrder(props.item)">
                          <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <!-- <v-btn icon class="mx-0">
                          <v-icon color="pink">delete</v-icon>
                        </v-btn> -->
                      </td>
                    </template>
                    <template slot="no-data">
                      <!-- <v-btn color="primary">Reset</v-btn> -->
                      <p>No Active Order Available for This Table</p>
                    </template>
                  </v-data-table>
               </v-layout>
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
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="editedItem.KOTQuantity" label="Quantity" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="editedItem.KOTRate" label="Rate" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
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
    <!-- Model for Edit Active Order List Item -->
    <v-dialog v-model="editActiveOrderModel" max-width="500px">
        <v-card>
            <v-card-title>
              <span class="headline">Edit/Modify Active Order</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editActiveOrderItem.ItemName" label="Item Name" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 align-end flexbox>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <td class="text-xs-right">
                        <v-btn fab dark small color="red" @click="cancelActiveOrder()"><v-icon dark>remove</v-icon></v-btn>
                        {{ editActiveOrderItem.KOTQuantity }}
                        <!-- <v-btn fab dark small color="green" @click="addQuantity(props.item)"><v-icon dark>add</v-icon></v-btn> -->
                    </td>
                    <!-- <v-btn fab dark small color="red" @click=""><v-icon dark>remove</v-icon></v-btn> -->
                    <!-- <v-text-field v-model="editActiveOrderItem.KOTQuantity" label="Quantity" disabled></v-text-field> -->
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editActiveOrderItem.KOTRate" label="Rate" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editActiveOrderItem.KOTAmount" label="Amount" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="editActiveOrderItem.AdditionalInstructions"
                      rows="1"
                      multi-line
                      disabled>
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
              <v-btn color="blue darken-1" flat @click.native="editActiveOrderModel = false">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click.native="updateModifyActiveOrder">Save</v-btn>
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
    <!-- Model for Merge Table -->
     <v-dialog v-model="mergeTableModel" max-width="500px">
        <v-card>
            <v-card-title>
              <span class="headline">Merge Tables</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <!-- <v-select
                      :items="OccupiedTableList"
                      v-model="MerageTables"
                      label="Select Table Name to be Merged"
                      required
                      item-text="TBLName"
                      item-value="TBLID"
                      :rules="[v => !!v || 'Please Table']"
                      autocomplete
                      :search-input.sync="search">
                    </v-select> -->
                    <h2> Current Table: <span style="color:red">{{ mergeTablesName }}</span> </h2>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                                        <v-select
                      :items="OccupiedTableLists"
                      v-model="MerageTabless"
                      label="Select Table Name to be Merged"
                      required
                      item-text="TBLName"
                      item-value="TBLID"
                      :rules="[v => !!v || 'Please Table']"
                      autocomplete
                      :search-input.sync="searchh">
                    </v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="mergeTableModel = false">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click.native="MergeTwoTables()">Merge</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Model for Trasfer Table -->
     <v-dialog v-model="transferTableModel" max-width="500px">
        <v-card>
            <v-card-title>
              <span class="headline">Transfer Table</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <!-- <v-select
                      :items="vacantTables"
                      v-model="transferTables"
                      label="Select Table Name to be Transfer (From)"
                      required
                      item-text="TBLName"
                      item-value="TBLID"
                      :rules="[v => !!v || 'Please Table']"
                      autocomplete
                      :search-input.sync="transferSearch">
                    </v-select> -->
                   <h2> Current Table: <span style="color:red">{{ transferTablesName }}</span> </h2>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                                        <v-select
                      :items="vacantTabless"
                      v-model="transferTabless"
                      label="Select Table Name to be Transfer (To)"
                      required
                      item-text="TBLName"
                      item-value="TBLID"
                      :rules="[v => !!v || 'Please Table']"
                      autocomplete
                      :search-input.sync="transferSearchh">
                    </v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="transferTableModel = false">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click.native="transferTable()">Transfer</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-app>
</div>
</template>
<script>
import router from '../router'
import axios from './Services/httpClient.js'
export default {
  data () {
    return {
      searchFoodItem: '',
      foodItem: [],
      vacantTable: false,
      occupiedTable: false,
      paxData: [],
      paxId: 1,
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
        // { text: 'Amount', value: 'Amount' },
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
      editItemModel: false,
      vacantOrderQuantity: 0,
      vacantOrderTotalAmount: 0,
      snackbar: false,
      snackbarcolor: '',
      snackbarText: '',
      activeOrderHeaders: [
        {
          text: 'Item Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Quantity', value: 'Quantity' },
        { text: 'Rate', value: 'Rate' },
        // { text: 'Amount', value: 'Amount' }
        { text: 'Action', value: 'Action' }
      ],
      activeOrderitems: [],
      editActiveOrderItem: {
        AdditionalInstructions: '',
        ItemId: '',
        ItemName: '',
        KOTNO: '',
        KOTAmount: '',
        KOTQuantity: '',
        totalCurrentQuantity: '',
        KOTRate: '',
        SlNo: '',
        KCATID: ''
      },
      editActiveOrderModel: false,
      mergeTableModel: false,
      OccupiedTableList: [],
      OccupiedTableLists: [],
      MerageTables: '',
      mergeTablesName: '',
      MerageTabless: '',
      search: null,
      searchh: null,
      vacantTables: [],
      vacantTabless: [],
      transferTableModel: false,
      transferTables: '',
      transferTablesName: '',
      transferTabless: '',
      transferSearch: null,
      transferSearchh: null,
      itemCategoryList: [],
      categoryId: null,
      PrinterStatus: null
    }
  },
  watch: {
    search (val) {
      val && val !== this.MerageTables && this.SearchOccupiedTable(val)
    },
    searchh (vall) {
      vall && vall !== this.MerageTabless && this.SearchOccupiedTables(vall)
    },
    transferSearch (val) {
      val && val !== this.transferTables && this.SearchVacantTable(val)
    },
    transferSearchh (vall) {
      vall && vall !== this.transferTabless && this.SearchVacantTables(vall)
    }
  },
  beforeMount () {
    this.renderTableTypeView()
    this.loadFoodItem()
    this.createPaxId()
    this.getWaiterList()
    this.loadOrderItem()
    if (localStorage.getItem('TableType') === 'OccupiedTables') {
      this.fetchActiveOrderList()
    }
    this.getItemCategory()
  },
  methods: {
    renderTableTypeView () {
      if (localStorage.getItem('TableType') === 'VacantTables') {
        this.vacantTable = true
      } else if (localStorage.getItem('TableType') === 'OccupiedTables') {
        this.occupiedTable = true
      }
    },
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
      let repeatOrder = false
      console.log('TTT', localStorage.getItem('Orders'))
      if (!localStorage.getItem('Orders')) {
        console.log('Yhai hai bhai vo', this.$parent.Order)
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
        console.log('Payload', preOrderItem)
        console.log('Test 1', localStorage.getItem('Orders'))
        this.$parent.Order = JSON.parse(localStorage.getItem('Orders'))
        this.$parent.Order.forEach(data => {
          console.log('Data In Loop---**', data)
          if (data.ItemId === preOrderItem.ItemId) {
            console.log('Repeating the order', data)
            data.KOTQuantity += 1
            repeatOrder = true
          }
        })
        if (this.$parent.Order.length === 0) {
          console.log('YOOO')
          // this.$parent.Order = JSON.parse(localStorage.getItem('Orders'))
          this.$parent.Order.push(preOrderItem)
        } else if (!repeatOrder) {
          console.log('ELSEEE')
          console.log('Local Store Value', JSON.parse(localStorage.getItem('Orders')))
          // this.$parent.Order = JSON.parse(localStorage.getItem('Orders'))
          this.$parent.Order.push(preOrderItem)
        }
        this.vacantOrderQuantity = this.$parent.Order.length
        this.vacantOrderTotalAmount = this.vacantOrderTotalAmount + preOrderItem.KOTAmount
        let orderSl = 1
        if (this.occupiedTable) {
          console.log('COming in if bcz its occupied table')
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
        this.newItem.KOTQuantity = 1
        this.newItem.ItemId = 0
        this.newItem.SlNo = 1
        this.newItem.ItemName = ''
        this.newItem.KOTRate = 1
        this.newItem.KOTAmount = 1
        this.newItem.KCATID = 0
        this.newItem.AdditionalInstructions = ''
        this.snackbarcolor = 'success'
        this.snackbarText = 'Successfully Added Into Cart'
        this.snackbar = true
        this.searchFoodItem = ''
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
      this.vacantOrderTotalAmount += item.KOTRate
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
        this.vacantOrderTotalAmount -= item.KOTRate
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
      this.vacantOrderTotalAmount = this.vacantOrderTotalAmount - this.Orderitems[index].KOTAmount
      this.Orderitems.splice(index, 1)
      localStorage.setItem('Orders', JSON.stringify(this.Orderitems))
      this.loadOrderItem()
      //   this.DeleteItemdialog = false
      this.vacantOrderQuantity = this.Orderitems.length
      this.snackbarcolor = 'success'
      this.snackbarText = 'Deleted Successfully'
      this.snackbar = true
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
    checkoutOrderInVacantTable () {
      /**
       * if conditon for checking if waiterId is there or not waiter Id is not there it will show the pop-up
       * else if conditon for checking if PaxId is there or not if waxId is not there it will show the pop-up
       * else if condition will run all API calls regarding Kitchen Order
       */
      axios.checkAllPrinterStatus().then(response => {
        console.log('Printer Status', response)
        this.PrinterStatus = response
      })
      // if (!this.PrinterStatus) {
      //   this.snackbarcolor = 'error'
      //   this.snackbarText = 'Please Add All Printer Data before Placing the Order'
      //   this.snackbar = true
      // } else
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
        console.log('Final Payload Body for order', FinalOrder)
        /**
        * Place The Order #send request to server
        */
        axios.placeOrder(FinalOrder).then(data => {
          console.log('Place order response from server', data)
          if (data.status === 200) {
            // change table status
            axios.updateTableStatus(localStorage.getItem('TableNumber')).then((response) => {
              console.log('Changin table status', response)
            })
            // send for Print
            axios.printKOT(localStorage.getItem('TableNumber')).then(res => {
              console.log('Printer Response from server', res)
              this.snackbarcolor = 'success'
              this.snackbarText = 'Order Printing...'
              this.snackbar = true
            })
            console.log('Getting response from server is 200')
            localStorage.removeItem('Orders')
            this.$parent.Order = []
            this.fetchActiveOrderList()
            this.loadOrderItem()
            this.snackbarcolor = 'success'
            this.snackbarText = 'Order placed successfully'
            this.snackbar = true
            setTimeout(function () {
              router.push({name: 'NewHome'})
            }, 3000)
          }
        })
      }
    },
    fetchActiveOrderList () {
      axios.fetchActiveOrderList(localStorage.getItem('TableNumber')).then((data) => {
        console.log('Fetch Active order', data)
        if (data.ItemsList === null) {
          console.log('Coming in If Conditon')
          localStorage.setItem('activeOrders', JSON.stringify([]))
        } else {
          console.log('Coming in Else Conditon')
          localStorage.setItem('activeOrders', JSON.stringify(data.ItemsList))
        }
        // localStorage.setItem('WaiterId', data.WaiterId)
        // localStorage.setItem('KOTNumber', data.KOTNO)
        // localStorage.setItem('PAX', data.PAX)
        this.KOTNumber = data.KOTNO
        this.waiterId = data.WaiterId
        if (data.PAX === 0) {
          this.paxId = 1
        } else {
          this.paxId = data.PAX
        }
        this.activeOrderitems = JSON.parse(localStorage.getItem('activeOrders'))
        console.log('Active order from localstorage', this.activeOrderitems)
        console.log('Waiter Id', this.waiterId)
      })
    },
    modifyActiveOrder (item) {
      console.log('Modify Active order', item)
      this.editActiveOrderItem.AdditionalInstructions = item.AdditionalInstructions
      this.editActiveOrderItem.ItemId = item.ItemId
      this.editActiveOrderItem.ItemName = item.ItemName
      this.editActiveOrderItem.KOTNO = item.KOTNO
      this.editActiveOrderItem.KOTAmount = item.KOTAmount
      this.editActiveOrderItem.KOTQuantity = item.KOTQuantity
      this.editActiveOrderItem.totalCurrentQuantity = item.KOTQuantity
      this.editActiveOrderItem.KOTRate = item.KOTRate
      this.editActiveOrderItem.SlNo = item.SlNo
      this.editActiveOrderItem.KCATID = item.KCATID
      this.editActiveOrderModel = true
    },
    cancelActiveOrder () {
      if (this.editActiveOrderItem.KOTQuantity > 0) {
        this.editActiveOrderItem.KOTQuantity -= 1
        this.editActiveOrderItem.KOTAmount = this.editActiveOrderItem.KOTRate * this.editActiveOrderItem.KOTQuantity
      }
    },
    updateModifyActiveOrder () {
      if (this.editActiveOrderItem.totalCurrentQuantity > this.editActiveOrderItem.KOTQuantity) {
        let QuantityToRemove = this.editActiveOrderItem.totalCurrentQuantity - this.editActiveOrderItem.KOTQuantity
        let KotNumber = this.editActiveOrderItem.KOTNO
        let ItemId = this.editActiveOrderItem.ItemId
        let KCATID = this.editActiveOrderItem.KCATID
        let ItemName = this.editActiveOrderItem.ItemName
        let tableName = localStorage.getItem('TableName')
        let wtrId = this.waiterId
        let PAX = this.paxId
        console.log(QuantityToRemove, KotNumber, ItemId)
        axios.cancelActiveOrderQuantity(KotNumber, ItemId, QuantityToRemove).then(data => {
          console.log('Response from server for cancel the Quantity', data)
          axios.cancelPrintKOT(KCATID, KotNumber, ItemName, QuantityToRemove, tableName, wtrId, PAX).then(res => {
            console.log('cancel printout response', res)
          })
          this.fetchActiveOrderList()
          this.editActiveOrderModel = false
        })
      }
    },
    SearchOccupiedTable (val) {
      console.log('Calling Search Occupied Tables', val)
      axios.filterOccupiedTables(val).then(data => {
        console.log('Response from server', data)
        this.OccupiedTableList = data
        console.log('Table Id', this.MerageTables)
      })
    },
    SearchOccupiedTables (vall) {
      console.log('Calling Search Occupied Tables', vall)
      axios.filterOccupiedTables(vall).then(data => {
        console.log('Response from server', data)
        this.OccupiedTableLists = data
        console.log('Table Id', this.MerageTabless)
      })
    },
    MergeTwoTables () {
      const oldTable = this.MerageTables
      const newTable = this.MerageTabless
      if (oldTable && newTable) {
        axios.merageTables(oldTable, newTable).then(data => {
          console.log('Merge response from server', data)
          this.mergeTableModel = false
          this.snackbarcolor = 'success'
          this.snackbarText = 'Tables merged Successfully'
          this.snackbar = true
          setTimeout(function () {
            router.push({name: 'NewHome'})
          }, 3000)
        })
      }
    },
    SearchVacantTable (val) {
      console.log('Calling Search Occupied Tables', val)
      axios.filterOccupiedTables(val).then(data => {
        console.log('Response from server', data)
        this.vacantTables = data
        console.log('Table Id', this.vacantTables)
      })
    },
    SearchVacantTables (vall) {
      console.log('Calling Search Vacant Tables', vall)
      axios.filterVacantTables(vall).then(data => {
        console.log('Response from server', data)
        this.vacantTabless = data
        console.log('Table Id', this.vacantTabless)
      })
    },
    transferTable () {
      console.log('Old Table', this.transferTables)
      console.log('New Table', this.transferTabless)
      const oldTable = this.transferTables
      const newTable = this.transferTabless
      axios.transferTable(oldTable, newTable).then(data => {
        console.log('Shift Table Response from server', data)
        this.transferTableModel = false
        this.snackbarcolor = 'success'
        this.snackbarText = 'Table transfered Successfully'
        this.snackbar = true
        setTimeout(function () {
          router.push({name: 'NewHome'})
        }, 3000)
      })
    },
    TransferTableFun () {
      this.transferTables = localStorage.getItem('TableNumber')
      this.transferTablesName = localStorage.getItem('TableName')
      console.log('Trafer table', this.transferTables)
      this.transferTableModel = true
    },
    mergeTableFun () {
      this.MerageTables = localStorage.getItem('TableNumber')
      this.mergeTablesName = localStorage.getItem('TableName')
      this.mergeTableModel = true
    },
    rePrintOrder () {
      var TblNumber = localStorage.getItem('TableNumber')
      axios.rePrintKOT(TblNumber).then(res => {
        this.snackbarcolor = 'success'
        this.snackbarText = 'Re-printing the order....'
        this.snackbar = true
        console.log('Reprint Response from server')
      })
    },
    getItemCategory () {
      axios.fetchItemCategory().then(data => {
        console.log('category in Response', data)
        this.itemCategoryList = data
        console.log('this.itemCategoryList', this.itemCategoryList)
      })
    },
    fetchItemByCategoryId () {
      console.log('Calling on Onchange', this.categoryId)
      const tableNumber = localStorage.getItem('TableNumber')
      axios.fetchItemByCategory(tableNumber, this.categoryId).then(data => {
        console.log('Fetch Item by category', data)
        this.foodItem = data
      })
    },
    home () {
      router.push({name: 'NewHome'})
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
