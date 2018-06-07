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
        <span class="hidden-sm-and-down">Table Number - {{ displayTableNumber($route.params.tableName,$route.params.tableNumber) }}</span>
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
        <v-list two-line :search="search">
            <template v-for="(item, index) in foodItem">
              <!-- <v-subheader :key="item.ItemCode">Food Item List</v-subheader> -->
              <!-- <v-divider :key="index"></v-divider> -->
              <v-list-tile :key="item.title" avatar @click="itemSelection(item.ItemID,item.ItemName)">
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
    </v-content>
     <v-layout row justify-center>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="addItemIncart()">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
         
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
            <v-flex xs12 align-end flexbox>
                  <span style="font-size:25px;margin-right:1%">Item Name:</span>
                  <span style="font-size:25px;color:red">{{ items.ItemName }}</span>
            </v-flex>
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
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</div>
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
        KOTRate: 1,
        KOTAmount: 0,
        AdditionalInstructions: ''
      },
      foodItem: []
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
    this.loadFoodItem()
    console.log('LENGTH', this.$parent.Order.length)
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
    itemSelection (id, name) {
      const self = this
      self.items.ItemId = id
      self.items.SlNo = id
      self.items.ItemName = name
      // self.items.KOTQuantity = id
      // self.items.KOTRate = id
      self.items.KOTAmount = self.items.KOTQuantity * self.items.KOTRate
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
        this.dialog = false
      }
    },
    checkout () {
      router.push({name: 'Checkout'})
    }
  }
}
</script>
<style>

</style>
