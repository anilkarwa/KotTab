<template>
<div id="app">
  <v-app id="inspire">
      <v-toolbar color="cyan" dark>
            <v-toolbar-title>Printer Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat icon color="white" @click="home()">
               <v-icon>home</v-icon>
            </v-btn>
            <v-btn color="primary" @click="checkValidation">Check Validation</v-btn>
            <v-btn color="primary" @click="printFormatdialog = true">Print Format Setting</v-btn>
          <v-dialog v-model="Newdialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">Add New Printer Data</span>
            </v-card-title>
  
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="NewItem.Id" label="ID" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <!-- <v-text-field v-model="NewItem.KCatId" label="KCatId"></v-text-field> -->
                    <v-select
                      :items="kcatIdList"
                      v-model="NewItem.KCatId"
                      label="Kcat ID"
                      single-line
                      item-text="KCATName"
                      item-value="KCATID"
                      autocomplete
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <!-- <v-text-field v-model="NewItem.FoodAreaID" label="FoodAreaID"></v-text-field> -->
                    <v-select
                      :items="FoodAreaId"
                      v-model="NewItem.FoodAreaID"
                      label="Food Area Id"
                      single-line
                      item-text="FoodAreaName"
                      item-value="FoodAreaID"
                      autocomplete
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="NewItem.PrntPath" label="PrntPath"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="NewItem.PrntCopy" label="PrntCopy"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="Newdialog = false">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click="AddNewPrinterData()">Add Data</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
          </v-toolbar>
    <div>
      <v-data-table
        :headers="headers"
        :items="desserts"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <!-- <td>{{ props.item.Id }}</td> -->
          <td class="text-xs-right">{{ props.item.KCatName }}</td>
          <td class="text-xs-right">{{ props.item.FoodAreaName }}</td>
          <td class="text-xs-right">{{ props.item.PrntPath }}</td>
          <td class="text-xs-right">{{ props.item.PrntCopy }}</td>
          <td class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
               style="cursor: pointer;"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="confirmDeleteDialof(props.item)"
              style="cursor: pointer;"
            >
              delete
            </v-icon>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="fetchPrinterList">Reset</v-btn>
        </template>
      </v-data-table>
    </div>
    <!-- Dialog box for deleting the printer data -->
    <v-dialog
        v-model="DeletePrinterDataDialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">Are you sure you wanna delete this?</v-card-title>
  
          <v-card-text>
            Are you sure you wanna delete <span style="color:red">KCat Category Name: {{ confirmKCatName }}</span> Printer Data, if Yes click on agree button on right side.
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="DeletePrinterDataDialog = false"
            >
              Disagree
            </v-btn>
  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="deleteItem"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- dialog box code for adding new printer data  -->
      <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit Printer Data</span>
            </v-card-title>
  
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.Id" label="ID" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-select
                      :items="kcatIdList"
                      v-model="editedItem.KCatId"
                      label="Kcat ID"
                      single-line
                      item-text="KCATName"
                      item-value="KCATID"
                      autocomplete
                    ></v-select>
                    <!-- <v-text-field v-model="editedItem.KCatId" label="KCatId"></v-text-field> -->
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-select
                      :items="FoodAreaId"
                      v-model="editedItem.FoodAreaID"
                      label="Food Area Id"
                      single-line
                      item-text="FoodAreaName"
                      item-value="FoodAreaID"
                      autocomplete
                    ></v-select>
                    <!-- <v-text-field v-model="editedItem.FoodAreaID" label="FoodAreaID"></v-text-field> -->
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.PrntPath" label="PrntPath"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.PrntCopy" label="PrntCopy"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Model for Print Format Setting -->
        <v-dialog v-model="printFormatdialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Printer format setting</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="companyName" v-model="companyName" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="normalPrint" v-model="normalPrint" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="rePrint" v-model="rePrint" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="cancelledPrint" v-model="cancelledPrint" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    :items="showCompanyNameChoice"
                    v-model="showCompanyName"
                    label="showCompanyName"
                    single-line
                    item-text="name"
                    item-value="value"
                    autocomplete
                  ></v-select>
                  <!-- <v-text-field label="showCompanyName" v-model="showCompanyName" required></v-text-field> -->
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="lineBreakOnTop" v-model="lineBreakOnTop" type="number" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="lineBreakOnBottom" v-model="lineBreakOnBottom" type="number" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="printFormatdialog = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="updatePrintFormat()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- Dialog box for Showing Missing Printer data list -->
    <v-dialog
        v-model="MissingPrinterDataDialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">These Categories are missing in the Prtiner Setting!</v-card-title>
  
          <v-card-text>
            Category Name: <span style="color:red">{{ MissingCategoriesLists }}</span>.
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>  
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="MissingPrinterDataDialog = false"
            >
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
              <v-snackbar
                :timeout="snackbarTimeout"
                :color="snackbarColor"
                :top="'top'"
                :right="'right'"
                v-model="snackbar" > {{ snackbarText }} <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
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
      snackbar: false,
      snackbarColor: '',
      snackbarMode: 'vertical',
      snackbarTimeout: 3000,
      snackbarText: '',
      Newdialog: false,
      dialog: false,
      DeletePrinterDataDialog: false,
      newPrinterData: false,
      headers: [
        // {
        //   text: 'ID',
        //   align: 'left',
        //   sortable: false,
        //   value: 'Id'
        // },
        { text: 'KCatId', value: 'KCatId' },
        { text: 'FoodAreaID', value: 'FoodAreaID' },
        { text: 'PrntPath', value: 'PrntPath' },
        { text: 'PrntCopy', value: 'PrntCopy' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        Id: '',
        KCatId: 0,
        FoodAreaID: 0,
        PrntPath: 0,
        PrntCopy: 0
      },
      DeleteItem: {
        Id: ''
      },
      NewItem: {
        Id: '',
        KCatId: '',
        FoodAreaID: '',
        PrntPath: '',
        PrntCopy: ''
      },
      kcatIdList: [],
      FoodAreaId: [],
      printFormatdialog: false,
      MissingPrinterDataDialog: false,
      cancelledPrint: '',
      companyName: '',
      lineBreakOnBottom: 0,
      lineBreakOnTop: 0,
      normalPrint: '',
      rePrint: '',
      showCompanyName: '',
      showCompanyNameChoice: [
        {
          name: 'Yes',
          value: 'Y'
        },
        {
          name: 'No',
          value: 'N'
        }
      ],
      confirmKCatName: '',
      MissingCategoriesLists: ''
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  beforeMount: function () {
    // this.fetchPrinterList()
    this.adminAuth()
    this.loadKcatId()
    this.loadFoodAreaId()
    this.getPrintFormat()
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.fetchPrinterList()
  },

  methods: {
    adminAuth () {
      if (localStorage.getItem('userType') !== 'ADMIN') {
        console.log('Comin in Admin Auth')
        router.push({name: 'NewHome'})
      }
    },
    editItem (item) {
      console.log('Edit Item', item)
      this.editedItem.Id = item.Id
      this.editedItem.KCatId = item.KCatId
      this.editedItem.FoodAreaID = item.FoodAreaID
      this.editedItem.PrntPath = item.PrntPath
      this.editedItem.PrntCopy = item.PrntCopy
      this.dialog = true
    },

    confirmDeleteDialof (item) {
      console.log('Item List for delting the Printer', item.KCatName)
      this.confirmKCatName = item.KCatName
      this.DeletePrinterDataDialog = true
      this.DeleteItem.Id = item.Id
      // this.deleteItem(item.Id)
    },

    deleteItem () {
      const parameter = 'api/PrinterSettings/' + this.DeleteItem.Id
      axios.DeletePrinterdata(parameter).then(response => {
        if (response.status === 200) {
          this.fetchPrinterList()
          this.snackbarColor = 'success'
          this.snackbarText = 'Successfully Deleted from server'
          this.snackbar = true
          console.log('Delete response from server', response)
        }
      })
      this.DeletePrinterDataDialog = false
      // const index = this.desserts.indexOf(item)
      // confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      const parameter = 'api/PrinterSettings/' + this.editedItem.Id + '?kcatid=' + this.editedItem.KCatId + '&foodareaid=' + this.editedItem.FoodAreaID + '&printpath=' + this.editedItem.PrntPath + '&printcopy=' + this.editedItem.PrntCopy
      axios.updatePrinterdata(parameter).then(response => {
        if (response.status === 200) {
          this.fetchPrinterList()
          this.snackbarColor = 'success'
          this.snackbarText = 'Successfully Updated Printer data'
          this.snackbar = true
        }
      })
      this.close()
    },

    fetchPrinterList () {
      axios.fetchPrinterList().then(response => {
        this.desserts = response
        console.log('Printer List', response)
      })
    },

    AddNewPrinterData () {
      if (this.NewItem.KCatId && this.NewItem.FoodAreaID && this.NewItem.PrntPath && this.NewItem.PrntCopy) {
        const parameter = 'api/PrinterSettings?kcatid=' + this.NewItem.KCatId + '&foodareaid=' + this.NewItem.FoodAreaID + '&printpath=' + this.NewItem.PrntPath + '&printcopy=' + this.NewItem.PrntCopy
        axios.addPrinterData(parameter).then(response => {
          if (response.status === 200) {
            this.fetchPrinterList()
            this.snackbarColor = 'success'
            this.snackbarText = 'Successfully Added Printer data'
            this.snackbar = true
            this.Newdialog = false
            console.log('Response from server for adding new data', response)
          }
        })
      } else {
        this.snackbarColor = 'error'
        this.snackbarText = 'Please Enter Valid data'
        this.snackbar = true
      }
    },

    loadKcatId () {
      axios.getKcatId().then(response => {
        console.log('Kcat ID:', response)
        this.kcatIdList = response
      })
    },
    loadFoodAreaId () {
      axios.getFoodAreaId().then(response => {
        console.log('Food Area ID', response)
        this.FoodAreaId = response
      })
    },
    home () {
      router.push({name: 'NewHome'})
    },
    getPrintFormat () {
      axios.fetchPrintFormat().then(data => {
        console.log('Data from Server for Print Format', data)
        this.cancelledPrint = data.cancelledPrint
        this.companyName = data.companyName
        this.lineBreakOnBottom = data.lineBreakOnBottom
        this.lineBreakOnTop = data.lineBreakOnTop
        this.normalPrint = data.normalPrint
        this.rePrint = data.rePrint
        this.showCompanyName = data.showCompanyName
      })
    },
    updatePrintFormat () {
      const payload = {
        companyName: this.companyName,
        normalPrint: this.normalPrint,
        rePrint: this.rePrint,
        cancelledPrint: this.cancelledPrint,
        showCompanyName: this.showCompanyName,
        lineBreakOnTop: this.lineBreakOnTop,
        lineBreakOnBottom: this.lineBreakOnBottom
      }
      axios.updatePrintFormat(payload).then(data => {
        console.log('Update Req Respone', data)
      })
      console.log('Payload', payload)
      this.printFormatdialog = false
    },
    checkValidation () {
      axios.checkAllPrinterStatus().then(data => {
        // console.log('checkValidation', data)
        if (data === 'true') {
          this.snackbarColor = 'success'
          this.snackbarText = 'Everything is good to Go!'
          this.snackbar = true
        } else {
          console.log('Something needs to add here!', data)
          this.MissingCategoriesLists = data
          this.MissingPrinterDataDialog = true
        }
      })
    }
  }
}
</script>
<style>

</style>
