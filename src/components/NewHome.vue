<template>
<div id="app">
  <v-app id="inspire">
    <div>
      <v-toolbar color="blue darken-3" dark>
        <v-toolbar-title style="font-size: 14px" class="white--text">{{companyName}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title style="font-size: 14px" class="white--text">POSTAB</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title class="white--text">      
          <v-icon @click="tableSelectionDialog = true">account_circle</v-icon>
        </v-toolbar-title>
        <!-- <v-toolbar-title class="white--text">Designed By <a href="http://www.softvent.com/">Softvent.com</a></v-toolbar-title> -->
        <v-toolbar-title class="white--text">
          <v-icon v-if="AdminLogin"  @click="ShowPrinterSetting" style="margin-right: 15px">settings</v-icon>
          <v-icon @click="logoutDialogBox">logout</v-icon>
        </v-toolbar-title>
      </v-toolbar>
        <v-container
          fluid
          style="min-height: 0;"
          grid-list-lg>
          <v-layout row justify-space-between>
            <v-flex  class="elevation-24" v-if="vaccantTable">
              <v-card dark color="blue darken-3">
                <v-card-title class="card-title">
                  <v-text-field
                    v-model="searchVacantTable"
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search Vaccant Table"
                    @input="FilterVacantTable()"
                    clearable
                ></v-text-field>
                <h2 style="margin-left: 10px">({{vacantTableCount}})</h2>
                </v-card-title>
              </v-card>
                <v-container grid-list-md text-xs-center fluid class="itemContainer">
                  <div class="itemList">
                    <v-layout row wrap justify-space-between>
                        <v-flex v-for="table in vacantTables" :key="table.TBLName" @click="selectVacantTable(table.TBLID,table.TBLName)" >
                            <p class="table-number vaccant">{{ table.TBLName }}</p>
                        </v-flex>
                    </v-layout>
                  </div>
                </v-container>
                <!-- <v-alert
                  :value="true"
                  color="warning"
                  class="text-lg-center"
                >
                  <h3>Total Vacant Tables: &nbsp; &nbsp;{{vacantTableCount}}&nbsp; &nbsp;</h3>
                </v-alert> -->
            </v-flex>
            <v-flex  class="elevation-24" v-if="occupiedTable">
              <v-card dark color="blue darken-3">
                <v-card-title class="card-title">
                  <v-text-field
                    v-model="searchOccupiedTable"
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search Occupied Table"
                    @input="FilterOccupiedTable()"
                    clearable
                ></v-text-field>
                <h2 style="margin-left: 10px">({{occupiedTableCount}})</h2>
                </v-card-title>
              </v-card>
                <v-container grid-list-md text-xs-center class="itemContainer">
                  <div class="itemList">
                    <v-layout row wrap justify-space-between>
                        <v-flex v-for="table in occupiedTables" :key="table.TBLName" @click="selectOccupiedTable(table.TBLID,table.TBLName)">
                           <p class="table-number occupied">{{ table.TBLName }}</p>
                        </v-flex>
                    </v-layout>
                  </div>
                </v-container>
                <!-- <v-alert
                  :value="true"
                  color="success"
                  class="text-lg-center"
                >
                  <h3>Total Occupied Tables: &nbsp;&nbsp;{{occupiedTableCount}} &nbsp;</h3>
                </v-alert> -->
            </v-flex>
            <v-flex  class="elevation-24" v-if="billingTable">
          <v-card dark color="blue darken-3">
            <v-card-title class="card-title"><v-text-field
                v-model="searchPendingPaymentTable"
                flat
                solo-inverted
                prepend-icon="search"
                label="Billed / Pending for Payment"
                @input="FilterPendingPaymentTable()"
                clearable
            ></v-text-field>
            <h2 style="margin-left: 10px">({{pendingPaymentTableCount}})</h2>
            </v-card-title>
          </v-card>
            <v-container grid-list-md text-xs-center class="itemContainer">
              <div class="itemList">
                <v-layout row wrap justify-space-between>
                    <v-flex v-for="table in pendingPaymentTable" :key="table.TBLName" @click="selectPendingPaymentTable(table.TBLID,table.TBLName)">
                        <p class="table-number billing">{{ table.TBLName }}</p>
                    </v-flex>
                </v-layout>
              </div>
            </v-container>
            <!-- <v-alert
              :value="true"
              color="error"
              class="text-lg-center"
            >
              <h3>Pending Payment Tables: {{pendingPaymentTableCount}} </h3>
            </v-alert> -->
        </v-flex>
          </v-layout>
        </v-container>
    </div>
    <v-dialog
        v-model="LogoutDialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">Logout?</v-card-title>
  
          <v-card-text>
            Are you sure you wanna logout ?
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="LogoutDialog = false"
            >
              Disagree
            </v-btn>
  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="logout()"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="tableSelectionDialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">Select Tables</v-card-title>
  
          <v-card-text>
            <v-switch color="blue darken-3" v-model="vaccantTable" label="Vaccant"></v-switch>
            <v-switch color="blue darken-3" v-model="occupiedTable" label="Occupied"></v-switch>
            <v-switch color="blue darken-3" v-model="billingTable" label="Billing"></v-switch>
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="tableSelectionDialog = false"
            >
              Done
            </v-btn>
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
      vacantTables: [],
      searchVacantTable: '',
      vacantTableCount: 0,
      occupiedTables: [],
      searchOccupiedTable: '',
      occupiedTableCount: 0,
      pendingPaymentTable: [],
      searchPendingPaymentTable: '',
      pendingPaymentTableCount: 0,
      AdminLogin: false,
      userName: '',
      companyName: '',
      LogoutDialog: false,
      tableSelectionDialog: false,
      vaccantTable: true,
      occupiedTable: false,
      billingTable: false,
      fetchInterval: null
    }
  },
  created: function () {
    this.adminAuth()
    this.getTableCount()
  },
  mounted () {
    this.todo()
    this.fetchLatestTableStatus()
  },
  methods: {
    /**
     * Code for Vacant Tables
     */
    todo: function () {
      this.getVacantTables()
      this.getOccupiedTables()
      this.getPendingPaymentTables()
    },
    fetchLatestTableStatus () {
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.fetchInterval)
      })
      this.fetchInterval = setInterval(() => {
        this.todo()
      }, 10000)
    },
    adminAuth () {
      if (localStorage.getItem('userType') === 'ADMIN') {
        this.AdminLogin = true
      }
      this.userName = localStorage.getItem('UserName')
      this.companyName = localStorage.getItem('companyName')
    },
    getTableCount () {
      axios.fetchTableCount().then(data => {
        console.log('table Count from server', data)
        this.vacantTableCount = data.vacantTable
        this.occupiedTableCount = data.occupiedTable
        this.pendingPaymentTableCount = data.paymentTable
      })
    },
    FilterVacantTable () {
      if (this.searchVacantTable) {
        console.log('Search key for Vacant Table', this.searchVacantTable)
        axios.filterVacantTables(this.searchVacantTable).then(data => {
          this.vacantTables = data
        })
      } else {
        this.getVacantTables()
      }
    },
    getVacantTables () {
      axios.getVacantTables().then((data) => {
        console.log('Data Table in Response', data)
        this.vacantTables = data
        // this.vacantTableCount = data.length
        console.log('V: data in vacantTables', this.vacantTables)
      })
    },
    selectVacantTable (tableNumber, tableName) {
      console.log('V Table Number', tableNumber)
      console.log('V Table Name', tableName)
      localStorage.setItem('TableType', 'VacantTables')
      localStorage.setItem('Orders', [])
      localStorage.setItem('activeOrders', [])
      localStorage.setItem('pointingTable', 'VacantTables')
      localStorage.setItem('TableName', tableName)
      localStorage.setItem('TableNumber', tableNumber)
      this.$parent.Order = []
      router.push({name: 'OrderManagement'})
    },
    /**
     * Code for Occupied table
     */
    FilterOccupiedTable () {
      if (this.searchOccupiedTable) {
        console.log('Search key for Vacant Table', this.searchOccupiedTable)
        axios.filterOccupiedTables(this.searchOccupiedTable).then(data => {
          this.occupiedTables = data
        })
      } else {
        this.getOccupiedTables()
      }
    },
    getOccupiedTables () {
      axios.getOccupiedTables().then((data) => {
        console.log('Data Table Response', data)
        this.occupiedTables = data
        // this.occupiedTableCount = data.length
        console.log('O: Data in occupiedTables', this.occupiedTables)
      })
    },
    selectOccupiedTable (tableNumber, tableName) {
      console.log('O Table Number', tableNumber)
      console.log('O Table Name', tableName)
      localStorage.setItem('TableType', 'OccupiedTables')
      localStorage.setItem('Orders', [])
      localStorage.setItem('activeOrders', [])
      localStorage.setItem('pointingTable', 'OccupiedTables')
      localStorage.setItem('TableName', tableName)
      localStorage.setItem('TableNumber', tableNumber)
      this.$parent.Order = []
      router.push({name: 'OrderManagement'})
    },
    /**
     * Code for pending payment tables
     */
    FilterPendingPaymentTable () {
      if (this.searchPendingPaymentTable) {
        console.log('Search key for Vacant Table', this.searchPendingPaymentTable)
        axios.filterPendingPaymentTables(this.searchPendingPaymentTable).then(data => {
          this.pendingPaymentTable = data
        })
      } else {
        this.getPendingPaymentTables()
      }
    },
    getPendingPaymentTables () {
      console.log('1. coming in pending table fetch')
      axios.fetchPendingPaymentTables().then(data => {
        console.log('Data table in response', data)
        this.pendingPaymentTable = data
        // this.pendingPaymentTableCount = data.length
        console.log('PP: Data in this.occupiedTables', this.pendingPaymentTable)
      })
    },
    selectPendingPaymentTable (tableNumber, tableName) {
      console.log('PP Table Number', tableNumber)
      console.log('PP Table Name', tableName)
      // localStorage.setItem('TableType', 'Vacant Tables')
      // localStorage.setItem('Orders', [])
      // localStorage.setItem('activeOrders', [])
      // localStorage.setItem('pointingTable', 'VacantTables')
      // localStorage.setItem('TableName', tableName)
      // localStorage.setItem('TableNumber', tableNumber)
      // router.push({name: 'FinalScreen', params: {tableNumber: tableNumber, tableName: tableName}})
    },
    logoutDialogBox () {
      console.log('Logout Button')
      this.LogoutDialog = true
    },
    logout () {
      this.LogoutDialog = false
      localStorage.clear()
      router.push({name: 'Login'})
    },
    ShowPrinterSetting () {
      router.push({name: 'Printer'})
    },
    selectTables (tableType) {
      if (this.selectedTableTypes.includes(tableType)) {
        const index = this.selectedTableTypes.indexOf(tableType)
        if (index > -1) {
          this.selectedTableTypes.splice(index, 1)
        }
      } else {
        this.selectedTableTypes.push(tableType)
      }
    }
  }
}
</script>
<style scoped>
  .table-cell {
    text-align: center;
  }
  .table-icon {
    border: 5px solid #0000001f;
    border-radius: 50%;
    padding: 8px;
    max-width: 90px;
  }
  .table-icon:hover {
    background-color: #00BDD2;
    border: 2px solid rgba(0, 0, 0, 0.25);
  }
  .table-number.vaccant {
    border: 2px solid #1ABC9C;
    border-radius: 40px;
    height: 55px;
    width: 55px;
    padding: 13px 0px;
    font-size: 18px;
  }
  .table-number.occupied {
    border: 2px solid #F1C40F;
    border-radius: 40px;
    height: 55px;
    width: 55px;
    padding: 13px 0px;
    font-size: 18px;
  }
  .table-number.billing {
    border: 2px solid #CB4335;
    border-radius: 40px;
    height: 55px;
    width: 55px;
    padding: 13px 0px;
    font-size: 18px;
  }
  .itemContainer {
    /* width: 100vw; */
    height: 70vh;
    display: flex;
    flex-direction: column;
    min-width: 330px;
  }
  .itemList {
    flex-grow: 1;
    overflow-x: auto;
  }
  >>> .v-text-field__details {
    display: none;
  }
  >>> .v-toolbar__content {
    height: 38px !important;
  }
  .card-title {
    padding: 8px 10px 0px 0px;
  }
  .v-alert {
    padding: 2px;
  }

</style>
