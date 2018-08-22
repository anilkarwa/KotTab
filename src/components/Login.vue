<template>
<div id="login">
  <v-app id="inspire">
    <v-content>
      <v-container style="background-color:  #f5b041 " fluid fill-height>
        <v-layout  align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" ref="form">
                  <v-text-field 
                  v-model="loginDetails.username"
                  id="username"
                  :rules="userNameRules"
                  label="Username" required ></v-text-field>
                  <v-text-field 
                  v-model="loginDetails.password"
                  id="password" 
                  type="password"
                  :rules="passwordRules"
                  label="Password" required ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="login()" color="primary">Login</v-btn>
              </v-card-actions>
              <v-snackbar
                :timeout="snackbarTimeout"
                :color="snackbarColor"
                :multi-line="snackbarMode === 'multi-line'"
                :vertical="snackbarMode === 'vertical'"
                v-model="snackbar" > {{ snackbarText }} <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
              </v-snackbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>Designed and Develop by <a href="http://www.softvent.com/">Softvent</a> &copy; {{ new Date().getFullYear() }}</div>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</div>
</template>
<script>
import router from '../router'
import axios from './Services/httpClient.js'
export default {
  data () {
    return {
      valid: false,
      loginDetails: {
        username: '',
        password: ''
      },
      userNameRules: [
        v => !!v || 'Username is required',
        v => v.length <= 25 || 'Username must be less than 25 characters'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length <= 50 || 'Password must be less than 50 characters'
      ],
      snackbar: false,
      snackbarColor: 'error',
      snackbarMode: 'multi-line',
      snackbarTimeout: 6000,
      snackbarText: ''
    }
  },
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        const name = this.loginDetails.username
        const password = this.loginDetails.password
        axios.Login(name, password).then((response) => {
          console.log('Response from server', response)
          if (!(response.length === 0)) {
            localStorage.setItem('UserID', response[0].UserID)
            localStorage.setItem('userType', response[0].userType)
            router.push({name: 'NewHome', params: {resource: 'Test'}})
          } else {
            console.log('Invalid Username password')
            this.snackbarText = 'Invalid Credentials'
            this.snackbar = true
          }
        })
      } else {
        this.$refs.form.validate()
      }
    }
  }
}
</script>
<style>
</style>
