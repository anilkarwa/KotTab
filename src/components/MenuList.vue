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
              <v-btn dark flat @click.native="dialog = false">Save</v-btn>
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
            <v-flex class="text-xs-center" xs12 align-end flexbox>
                  <span>Item Name:</span><span>Coffee</span>
            </v-flex>
            <v-flex class="text-xs-center" xs12 align-end flexbox>
                  <span>Quntity:</span>
                  <v-btn fab dark small color="red" @click="Quntity = Quntity-1"><v-icon dark>remove</v-icon></v-btn>
                  {{ Quntity }}
                  <v-btn fab dark small color="green" @click="Quntity = Quntity+1"><v-icon dark>add</v-icon></v-btn>
            </v-flex>
            <v-flex class="text-xs-center" xs5 align-end flexbox>
               <v-text-field
                
                color="teal"
                multi-line
              >
                <div slot="label">
                  Bio <small>(optional)</small>
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
import axios from './Services/httpClient.js'
export default {
  data () {
    return {
      Quntity: 0,
      dialog: true,
      drawer: null,
      search: '',
      notifications: false,
      sound: true,
      widgets: false,
      items: [
        { header: 'Food Item List' },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
        { divider: true, inset: true },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend." },
        { divider: true, inset: true },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?" },
        { divider: true, inset: true },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/4.jpg', title: 'Birthday gift', subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?" },
        { divider: true, inset: true },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/5.jpg', title: 'Recipe to try', subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos." }
      ],
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
  },
  methods: {
    displayTableNumber (name) {
      if (!(name === undefined)) {
        localStorage.setItem('TableName', name)
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
      console.log('ID', id)
      console.log('Name', name)
      this.dialog = true
    }
  }
}
</script>
<style>

</style>
