<template>
<div id="app">
  <v-app id="inspire">
    <div>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title class="white--text">Priyadarshini Veg Restaturan</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title class="white--text">POSTAB</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-toolbar-title class="white--text">Designed By <a href="http://www.softvent.com/">Softvent.com</a></v-toolbar-title> -->
        <v-toolbar-title class="white--text"><v-btn slot="activator" color="cyan darken-3" dark class="mb-2" v-if="AdminLogin" @click="ShowPrinterSetting">Printer Setting</v-btn><v-btn slot="activator" color="cyan darken-3" dark class="mb-2" @click="logout">Logout</v-btn></v-toolbar-title>
      </v-toolbar>
        <v-container
          fluid
          style="min-height: 0;"
          grid-list-lg>
          <v-layout row wrap>
        <v-flex xs12 sm4 md4 class="elevation-24">
          <v-card dark color="blue darken-3">
            <v-card-title><v-text-field
                v-model="searchVacantTable"
                flat
                solo-inverted
                prepend-icon="search"
                label="Search Vaccant Table"
                @input="FilterVacantTable()"
            ></v-text-field></v-card-title>
          </v-card>
            <v-container grid-list-md text-xs-center class="itemContainer">
              <div class="itemList">
                <v-layout row wrap>
                    <v-flex v-for="table in vacantTables" :key="table.TBLName" @click="selectVacantTable(table.TBLID,table.TBLName)" xs6>
                        <img class="table-icon" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDk3LDEyMGMtOC4yOTEsMC0xNSw2LjcwOS0xNSwxNXYxNjZIMzMxYy0xNi41NjksMC0zMCwxMy40MzEtMzAsMzBjMCwxNi41NjcsMTMuNDMxLDMwLDMwLDMwdjEzNiAgICBjMCw4LjI5MSw2LjcwOSwxNSwxNSwxNWM4LjI5MSwwLDE1LTYuNzA5LDE1LTE1VjM2MWgxMjF2MTM2YzAsOC4yOTEsNi43MDksMTUsMTUsMTVjOC4yOTEsMCwxNS02LjcwOSwxNS0xNSAgICBjMC03LjA3OCwwLTM0Ny44MiwwLTM2MkM1MTIsMTI2LjcwOSw1MDUuMjkxLDEyMCw0OTcsMTIweiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTI4Niw0ODJoLTE1VjI3MGgtMzB2MjEyaC0xNWMtOC4yOTEsMC0xNSw2LjcwOS0xNSwxNWMwLDguMjkxLDYuNzA5LDE1LDE1LDE1aDYwYzguMjkxLDAsMTUtNi43MDksMTUtMTUgICAgQzMwMSw0ODguNzA5LDI5NC4yOTEsNDgyLDI4Niw0ODJ6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTgxLDMwMUgzMFYxMzVjMC04LjI5MS02LjcwOS0xNS0xNS0xNXMtMTUsNi43MDktMTUsMTVjMCw0LjgyLDAsMzYyLDAsMzYyYzAsOC4yOTEsNi43MDksMTUsMTUsMTVzMTUtNi43MDksMTUtMTVWMzYxICAgIGgxMjF2MTM2YzAsOC4yOTEsNi43MDksMTUsMTUsMTVzMTUtNi43MDksMTUtMTVWMzYxYzE2LjU2OSwwLDMwLTEzLjQzMywzMC0zMEMyMTEsMzE0LjQzMSwxOTcuNTY5LDMwMSwxODEsMzAxeiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQyMSwxODBoLTMwdi0zMi43NjNjMTcuNDIyLTYuMjEzLDMwLTIyLjcwNywzMC00Mi4yMzdWNDVjMC04LjI5MS02LjcwOS0xNS0xNS0xNWgtNjBjLTguMjkxLDAtMTUsNi43MDktMTUsMTV2NjAgICAgYzAsMTkuNTMsMTIuNTc4LDM2LjAyNCwzMCw0Mi4yMzdWMTgwaC03NXYtNjBjMC0yLjY5Mi0wLjg2Ni01LjEwNy0xLjUzMS03LjU4OEMyNzUuOTYsMTE3LjEwMywyNjYuMzU2LDEyMCwyNTYsMTIwICAgIGMtMTAuMzYyLDAtMTkuOTY5LTIuODc3LTI4LjQ4Mi03LjUxOGMtMC42NTQsMi40NjEtMS41MTgsNC44NS0xLjUxOCw3LjUxOHY2MGgtNzV2LTMyLjc2M2MxNy40MjItNi4yMTMsMzAtMjIuNzA3LDMwLTQyLjIzN1Y0NSAgICBjMC04LjI5MS02LjcwOS0xNS0xNS0xNWgtNjBjLTguMjkxLDAtMTUsNi43MDktMTUsMTV2NjBjMCwxOS41MywxMi41NzgsMzYuMDI0LDMwLDQyLjIzN1YxODBIOTFjLTE2LjU2OSwwLTMwLDEzLjQzMS0zMCwzMCAgICBjMCwxNi41NjcsMTMuNDMxLDMwLDMwLDMwaDMzMGMxNi41NjksMCwzMC0xMy40MzMsMzAtMzBDNDUxLDE5My40MzEsNDM3LjU2OSwxODAsNDIxLDE4MHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yNjguOTA1LDcuMzM5QzI2Ni4xOTUsMi43OTgsMjYxLjMwMywwLDI1NiwwYy01LjI4OCwwLTEwLjE5NSwyLjc4My0xMi44OTEsNy4zMzlDMjMzLjE5MiwyNC4wMDksMjI2LjE5LDUyLjUyOSwyMjYsNjAgICAgYzAsMTYuNTM4LDEzLjQ2MiwzMCwzMCwzMGMxNi41MzgsMCwzMC0xMy40NDcsMzAtMzAuMzY2QzI4NS44MSw1Mi41NTksMjc4LjgwOCwyNC4wMzgsMjY4LjkwNSw3LjMzOXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
                        <p class="table-number">{{ table.TBLName }}</p>
                    </v-flex>
                </v-layout>
              </div>
            </v-container>
            <v-alert
              :value="true"
              color="warning"
              class="text-lg-center"
            >
              <h1>Total: {{vacantTableCount}}</h1>
            </v-alert>
        </v-flex>
        <v-flex xs12 sm4 md4 class="elevation-24">
          <v-card dark color="blue darken-3">
            <v-card-title><v-text-field
                v-model="searchOccupiedTable"
                flat
                solo-inverted
                prepend-icon="search"
                label="Search Occupied Table"
                @input="FilterOccupiedTable()"
            ></v-text-field></v-card-title>
          </v-card>
            <v-container grid-list-md text-xs-center class="itemContainer">
              <div class="itemList">
                <v-layout row wrap>
                    <v-flex v-for="table in occupiedTables" :key="table.TBLName" @click="selectOccupiedTable(table.TBLID,table.TBLName)" xs6>
                        <img class="table-icon" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDk3LDEyMGMtOC4yOTEsMC0xNSw2LjcwOS0xNSwxNXYxNjZIMzMxYy0xNi41NjksMC0zMCwxMy40MzEtMzAsMzBjMCwxNi41NjcsMTMuNDMxLDMwLDMwLDMwdjEzNiAgICBjMCw4LjI5MSw2LjcwOSwxNSwxNSwxNWM4LjI5MSwwLDE1LTYuNzA5LDE1LTE1VjM2MWgxMjF2MTM2YzAsOC4yOTEsNi43MDksMTUsMTUsMTVjOC4yOTEsMCwxNS02LjcwOSwxNS0xNSAgICBjMC03LjA3OCwwLTM0Ny44MiwwLTM2MkM1MTIsMTI2LjcwOSw1MDUuMjkxLDEyMCw0OTcsMTIweiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTI4Niw0ODJoLTE1VjI3MGgtMzB2MjEyaC0xNWMtOC4yOTEsMC0xNSw2LjcwOS0xNSwxNWMwLDguMjkxLDYuNzA5LDE1LDE1LDE1aDYwYzguMjkxLDAsMTUtNi43MDksMTUtMTUgICAgQzMwMSw0ODguNzA5LDI5NC4yOTEsNDgyLDI4Niw0ODJ6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTgxLDMwMUgzMFYxMzVjMC04LjI5MS02LjcwOS0xNS0xNS0xNXMtMTUsNi43MDktMTUsMTVjMCw0LjgyLDAsMzYyLDAsMzYyYzAsOC4yOTEsNi43MDksMTUsMTUsMTVzMTUtNi43MDksMTUtMTVWMzYxICAgIGgxMjF2MTM2YzAsOC4yOTEsNi43MDksMTUsMTUsMTVzMTUtNi43MDksMTUtMTVWMzYxYzE2LjU2OSwwLDMwLTEzLjQzMywzMC0zMEMyMTEsMzE0LjQzMSwxOTcuNTY5LDMwMSwxODEsMzAxeiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQyMSwxODBoLTMwdi0zMi43NjNjMTcuNDIyLTYuMjEzLDMwLTIyLjcwNywzMC00Mi4yMzdWNDVjMC04LjI5MS02LjcwOS0xNS0xNS0xNWgtNjBjLTguMjkxLDAtMTUsNi43MDktMTUsMTV2NjAgICAgYzAsMTkuNTMsMTIuNTc4LDM2LjAyNCwzMCw0Mi4yMzdWMTgwaC03NXYtNjBjMC0yLjY5Mi0wLjg2Ni01LjEwNy0xLjUzMS03LjU4OEMyNzUuOTYsMTE3LjEwMywyNjYuMzU2LDEyMCwyNTYsMTIwICAgIGMtMTAuMzYyLDAtMTkuOTY5LTIuODc3LTI4LjQ4Mi03LjUxOGMtMC42NTQsMi40NjEtMS41MTgsNC44NS0xLjUxOCw3LjUxOHY2MGgtNzV2LTMyLjc2M2MxNy40MjItNi4yMTMsMzAtMjIuNzA3LDMwLTQyLjIzN1Y0NSAgICBjMC04LjI5MS02LjcwOS0xNS0xNS0xNWgtNjBjLTguMjkxLDAtMTUsNi43MDktMTUsMTV2NjBjMCwxOS41MywxMi41NzgsMzYuMDI0LDMwLDQyLjIzN1YxODBIOTFjLTE2LjU2OSwwLTMwLDEzLjQzMS0zMCwzMCAgICBjMCwxNi41NjcsMTMuNDMxLDMwLDMwLDMwaDMzMGMxNi41NjksMCwzMC0xMy40MzMsMzAtMzBDNDUxLDE5My40MzEsNDM3LjU2OSwxODAsNDIxLDE4MHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yNjguOTA1LDcuMzM5QzI2Ni4xOTUsMi43OTgsMjYxLjMwMywwLDI1NiwwYy01LjI4OCwwLTEwLjE5NSwyLjc4My0xMi44OTEsNy4zMzlDMjMzLjE5MiwyNC4wMDksMjI2LjE5LDUyLjUyOSwyMjYsNjAgICAgYzAsMTYuNTM4LDEzLjQ2MiwzMCwzMCwzMGMxNi41MzgsMCwzMC0xMy40NDcsMzAtMzAuMzY2QzI4NS44MSw1Mi41NTksMjc4LjgwOCwyNC4wMzgsMjY4LjkwNSw3LjMzOXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
                        <p class="table-number">{{ table.TBLName }}</p>
                    </v-flex>
                </v-layout>
              </div>
            </v-container>
            <v-alert
              :value="true"
              color="success"
              class="text-lg-center"
            >
              <h1>Total: {{occupiedTableCount}}</h1>
            </v-alert>
        </v-flex>
        <v-flex xs12 sm4 md4 class="elevation-24">
          <v-card dark color="blue darken-3">
            <v-card-title><v-text-field
                v-model="searchPendingPaymentTable"
                flat
                solo-inverted
                prepend-icon="search"
                label="Billed / Pending for Payment"
                @input="FilterPendingPaymentTable()"
            ></v-text-field></v-card-title>
          </v-card>
            <v-container grid-list-md text-xs-center class="itemContainer">
              <div class="itemList">
                <v-layout row wrap>
                    <v-flex v-for="table in pendingPaymentTable" :key="table.TBLName" @click="selectPendingPaymentTable(table.TBLID,table.TBLName)" xs6>
                        <img class="table-icon" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDk3LDEyMGMtOC4yOTEsMC0xNSw2LjcwOS0xNSwxNXYxNjZIMzMxYy0xNi41NjksMC0zMCwxMy40MzEtMzAsMzBjMCwxNi41NjcsMTMuNDMxLDMwLDMwLDMwdjEzNiAgICBjMCw4LjI5MSw2LjcwOSwxNSwxNSwxNWM4LjI5MSwwLDE1LTYuNzA5LDE1LTE1VjM2MWgxMjF2MTM2YzAsOC4yOTEsNi43MDksMTUsMTUsMTVjOC4yOTEsMCwxNS02LjcwOSwxNS0xNSAgICBjMC03LjA3OCwwLTM0Ny44MiwwLTM2MkM1MTIsMTI2LjcwOSw1MDUuMjkxLDEyMCw0OTcsMTIweiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTI4Niw0ODJoLTE1VjI3MGgtMzB2MjEyaC0xNWMtOC4yOTEsMC0xNSw2LjcwOS0xNSwxNWMwLDguMjkxLDYuNzA5LDE1LDE1LDE1aDYwYzguMjkxLDAsMTUtNi43MDksMTUtMTUgICAgQzMwMSw0ODguNzA5LDI5NC4yOTEsNDgyLDI4Niw0ODJ6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTgxLDMwMUgzMFYxMzVjMC04LjI5MS02LjcwOS0xNS0xNS0xNXMtMTUsNi43MDktMTUsMTVjMCw0LjgyLDAsMzYyLDAsMzYyYzAsOC4yOTEsNi43MDksMTUsMTUsMTVzMTUtNi43MDksMTUtMTVWMzYxICAgIGgxMjF2MTM2YzAsOC4yOTEsNi43MDksMTUsMTUsMTVzMTUtNi43MDksMTUtMTVWMzYxYzE2LjU2OSwwLDMwLTEzLjQzMywzMC0zMEMyMTEsMzE0LjQzMSwxOTcuNTY5LDMwMSwxODEsMzAxeiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQyMSwxODBoLTMwdi0zMi43NjNjMTcuNDIyLTYuMjEzLDMwLTIyLjcwNywzMC00Mi4yMzdWNDVjMC04LjI5MS02LjcwOS0xNS0xNS0xNWgtNjBjLTguMjkxLDAtMTUsNi43MDktMTUsMTV2NjAgICAgYzAsMTkuNTMsMTIuNTc4LDM2LjAyNCwzMCw0Mi4yMzdWMTgwaC03NXYtNjBjMC0yLjY5Mi0wLjg2Ni01LjEwNy0xLjUzMS03LjU4OEMyNzUuOTYsMTE3LjEwMywyNjYuMzU2LDEyMCwyNTYsMTIwICAgIGMtMTAuMzYyLDAtMTkuOTY5LTIuODc3LTI4LjQ4Mi03LjUxOGMtMC42NTQsMi40NjEtMS41MTgsNC44NS0xLjUxOCw3LjUxOHY2MGgtNzV2LTMyLjc2M2MxNy40MjItNi4yMTMsMzAtMjIuNzA3LDMwLTQyLjIzN1Y0NSAgICBjMC04LjI5MS02LjcwOS0xNS0xNS0xNWgtNjBjLTguMjkxLDAtMTUsNi43MDktMTUsMTV2NjBjMCwxOS41MywxMi41NzgsMzYuMDI0LDMwLDQyLjIzN1YxODBIOTFjLTE2LjU2OSwwLTMwLDEzLjQzMS0zMCwzMCAgICBjMCwxNi41NjcsMTMuNDMxLDMwLDMwLDMwaDMzMGMxNi41NjksMCwzMC0xMy40MzMsMzAtMzBDNDUxLDE5My40MzEsNDM3LjU2OSwxODAsNDIxLDE4MHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yNjguOTA1LDcuMzM5QzI2Ni4xOTUsMi43OTgsMjYxLjMwMywwLDI1NiwwYy01LjI4OCwwLTEwLjE5NSwyLjc4My0xMi44OTEsNy4zMzlDMjMzLjE5MiwyNC4wMDksMjI2LjE5LDUyLjUyOSwyMjYsNjAgICAgYzAsMTYuNTM4LDEzLjQ2MiwzMCwzMCwzMGMxNi41MzgsMCwzMC0xMy40NDcsMzAtMzAuMzY2QzI4NS44MSw1Mi41NTksMjc4LjgwOCwyNC4wMzgsMjY4LjkwNSw3LjMzOXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
                        <p class="table-number">{{ table.TBLName }}</p>
                    </v-flex>
                </v-layout>
              </div>
            </v-container>
            <v-alert
              :value="true"
              color="error"
              class="text-lg-center"
            >
              <h1>Total: {{pendingPaymentTableCount}} </h1>
            </v-alert>
        </v-flex>
          </v-layout>
        </v-container>
    </div>
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
      AdminLogin: false
    }
  },
  beforeMount: function () {
    this.getVacantTables()
    this.getOccupiedTables()
    this.getPendingPaymentTables()
    this.adminAuth()
    this.getTableCount()
  },
  methods: {
    /**
     * Code for Vacant Tables
     */
    adminAuth () {
      if (localStorage.getItem('userType') === 'ADMIN') {
        this.AdminLogin = true
      }
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
      }
    },
    getVacantTables () {
      axios.getVacantTables().then((data) => {
        console.log('Data Table in Response', data)
        this.vacantTables = data
        this.vacantTableCount = data.length
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
      }
    },
    getOccupiedTables () {
      axios.getOccupiedTables().then((data) => {
        console.log('Data Table Response', data)
        this.occupiedTables = data
        this.occupiedTableCount = data.length
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
      }
    },
    getPendingPaymentTables () {
      console.log('1. coming in pending table fetch')
      axios.fetchPendingPaymentTables().then(data => {
        console.log('Data table in response', data)
        this.pendingPaymentTable = data
        this.pendingPaymentTableCount = data.length
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
    logout () {
      localStorage.clear()
      router.push({name: 'Login'})
    },
    ShowPrinterSetting () {
      router.push({name: 'Printer'})
    }
  }
}
</script>
<style scoped>
  .table-cell {
    text-align: center;
  }
  .table-icon {
    border: 2px solid black;
    border-radius: 50%;
    padding: 7%;
  }
  .table-icon:hover {
    background-color: #00BDD2;
    border: 2px solid rgba(0, 0, 0, 0.25);
  }
  .table-number {
    font-weight: 400;
    font-size: 20px;
  }
  .itemContainer {
    /* width: 100vw; */
    height: 70vh;
    display: flex;
    flex-direction: column;
  }
  .itemList {
    flex-grow: 1;
    overflow-x: auto;
  }
</style>
