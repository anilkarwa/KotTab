<template>
<div id="app">
  <v-app id="inspire">
    <div>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title class="white--text">KotTab</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
        <v-container
          fluid
          style="min-height: 0;"
          grid-list-lg>
          <v-layout row wrap>
            <v-flex xs12 @click="menuSelection(1)">
              <v-card color="blue-grey darken-2" class="white--text">
                <v-container fluid grid-list-lg>
                  <v-layout row class="text-lg-center">
                    <v-flex xs12>
                        <div class="headline"><i class="material-icons">print</i> Printer Settinge</div>
                      <!-- <v-card-media
                        src="https://vuetifyjs.com/static/doc-images/cards/foster.jpg"
                        height="125px"
                        contain
                      ></v-card-media> -->
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs12 @click="menuSelection(2)">
              <v-card color="cyan darken-2" class="white--text">
                <v-container fluid grid-list-lg>
                  <v-layout row class="text-lg-center">
                    <v-flex xs12>
                      <div>
                        <div class="headline"><i class="material-icons">restaurant</i> Occupied Table</div>
                        <!-- <div>Foster the People</div> -->
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs12 @click="menuSelection(3)">
              <v-card color="purple" class="white--text">
                <v-container fluid grid-list-lg>
                  <v-layout row class="text-lg-center">
                    <v-flex xs12>
                      <div>
                        <div class="headline"><i class="material-icons">restaurant</i> Vacant Table</div>
                        <!-- <div>Ellie Goulding</div> -->
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
    </div>
  </v-app>
</div>
</template>
<script>
import router from '../router'
export default {
  data () {
    return {
    }
  },
  methods: {
    menuSelection: (id) => {
      if (id === 1) {
        console.log('Printer Setting')
        router.push({name: 'Printer'})
      } else if (id === 2) {
        console.log('Occupied Tables')
        router.push({name: 'OccupiedTables', params: {listTableType: 'Occupied Tables'}})
      } else if (id === 3) {
        console.log('Vacant Tables')
        router.push({name: 'VacantTables', params: {listTableType: 'Vacant Tables'}})
      }
      // this.$router.push({name: 'Tables', params: {categoryName: this.categoryName}})
    }
  }
}
</script>
<style scoped>

</style>
