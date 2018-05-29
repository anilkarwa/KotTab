<template>
<div id="app">
  <v-app id="inspire">
    <v-layout row>
      <v-flex xs12>
          <v-toolbar color="cyan" dark>
            <v-toolbar-title>KotTab</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
            <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex v-for="table in 15" :key="table" @click="selectTable(table)" xs3>
                        <img class="table-icon" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDk3LDEyMGMtOC4yOTEsMC0xNSw2LjcwOS0xNSwxNXYxNjZIMzMxYy0xNi41NjksMC0zMCwxMy40MzEtMzAsMzBjMCwxNi41NjcsMTMuNDMxLDMwLDMwLDMwdjEzNiAgICBjMCw4LjI5MSw2LjcwOSwxNSwxNSwxNWM4LjI5MSwwLDE1LTYuNzA5LDE1LTE1VjM2MWgxMjF2MTM2YzAsOC4yOTEsNi43MDksMTUsMTUsMTVjOC4yOTEsMCwxNS02LjcwOSwxNS0xNSAgICBjMC03LjA3OCwwLTM0Ny44MiwwLTM2MkM1MTIsMTI2LjcwOSw1MDUuMjkxLDEyMCw0OTcsMTIweiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTI4Niw0ODJoLTE1VjI3MGgtMzB2MjEyaC0xNWMtOC4yOTEsMC0xNSw2LjcwOS0xNSwxNWMwLDguMjkxLDYuNzA5LDE1LDE1LDE1aDYwYzguMjkxLDAsMTUtNi43MDksMTUtMTUgICAgQzMwMSw0ODguNzA5LDI5NC4yOTEsNDgyLDI4Niw0ODJ6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTgxLDMwMUgzMFYxMzVjMC04LjI5MS02LjcwOS0xNS0xNS0xNXMtMTUsNi43MDktMTUsMTVjMCw0LjgyLDAsMzYyLDAsMzYyYzAsOC4yOTEsNi43MDksMTUsMTUsMTVzMTUtNi43MDksMTUtMTVWMzYxICAgIGgxMjF2MTM2YzAsOC4yOTEsNi43MDksMTUsMTUsMTVzMTUtNi43MDksMTUtMTVWMzYxYzE2LjU2OSwwLDMwLTEzLjQzMywzMC0zMEMyMTEsMzE0LjQzMSwxOTcuNTY5LDMwMSwxODEsMzAxeiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQyMSwxODBoLTMwdi0zMi43NjNjMTcuNDIyLTYuMjEzLDMwLTIyLjcwNywzMC00Mi4yMzdWNDVjMC04LjI5MS02LjcwOS0xNS0xNS0xNWgtNjBjLTguMjkxLDAtMTUsNi43MDktMTUsMTV2NjAgICAgYzAsMTkuNTMsMTIuNTc4LDM2LjAyNCwzMCw0Mi4yMzdWMTgwaC03NXYtNjBjMC0yLjY5Mi0wLjg2Ni01LjEwNy0xLjUzMS03LjU4OEMyNzUuOTYsMTE3LjEwMywyNjYuMzU2LDEyMCwyNTYsMTIwICAgIGMtMTAuMzYyLDAtMTkuOTY5LTIuODc3LTI4LjQ4Mi03LjUxOGMtMC42NTQsMi40NjEtMS41MTgsNC44NS0xLjUxOCw3LjUxOHY2MGgtNzV2LTMyLjc2M2MxNy40MjItNi4yMTMsMzAtMjIuNzA3LDMwLTQyLjIzN1Y0NSAgICBjMC04LjI5MS02LjcwOS0xNS0xNS0xNWgtNjBjLTguMjkxLDAtMTUsNi43MDktMTUsMTV2NjBjMCwxOS41MywxMi41NzgsMzYuMDI0LDMwLDQyLjIzN1YxODBIOTFjLTE2LjU2OSwwLTMwLDEzLjQzMS0zMCwzMCAgICBjMCwxNi41NjcsMTMuNDMxLDMwLDMwLDMwaDMzMGMxNi41NjksMCwzMC0xMy40MzMsMzAtMzBDNDUxLDE5My40MzEsNDM3LjU2OSwxODAsNDIxLDE4MHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yNjguOTA1LDcuMzM5QzI2Ni4xOTUsMi43OTgsMjYxLjMwMywwLDI1NiwwYy01LjI4OCwwLTEwLjE5NSwyLjc4My0xMi44OTEsNy4zMzlDMjMzLjE5MiwyNC4wMDksMjI2LjE5LDUyLjUyOSwyMjYsNjAgICAgYzAsMTYuNTM4LDEzLjQ2MiwzMCwzMCwzMGMxNi41MzgsMCwzMC0xMy40NDcsMzAtMzAuMzY2QzI4NS44MSw1Mi41NTksMjc4LjgwOCwyNC4wMzgsMjY4LjkwNSw3LjMzOXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
                        <p class="table-number">{{ table }}</p>
                    </v-flex>
                </v-layout>
            </v-container>
      </v-flex>
    </v-layout>
  </v-app>
</div>
</template>
<script>
export default {
  data () {
    return {
      items: [
        { header: 'Today' },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
        { divider: true, inset: true },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend." },
        { divider: true, inset: true },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?" }
      ]
    }
  },
  methods: {
    selectTable (tableNumber) {
      console.log('Selected Table Number', tableNumber)
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
</style>
