import axios from 'axios'

class Axios {
  constructor () {
    this.axios = axios.create()
    this.axios.defaults.timeout = 30000
  }
  Login (name, pass) {
    const url = process.env.API_BASE.concat('/api/Login?')
    const username = 'Username='
    const userpassword = '&Password='
    // console.log('HTTP - name', name)
    // console.log('HTTP - password', pass)
    // console.log('HTTP - url before', name)
    const loginUrl = url.concat(username, name, userpassword, pass)
    // const loginUrl = 'http://47.23.106.203/kottab/api/Login?Username=staff&Password=svt1234'
    console.log('final URL', loginUrl)
    return this.axios.get(loginUrl, {
      timeout: 50000
    }).then((Response) => {
      console.log('Response', Response.data)
      return Response.data
    })
  }
  getOccupiedTables () {
    const getOccupiedTablesUrl = process.env.API_BASE.concat('/api/OccupiedTable')
    return this.axios.get(getOccupiedTablesUrl, {
      timeout: 50000
    }).then((Response) => {
      console.log('Response--', Response.data)
      return Response.data
    })
  }
  getVacantTables () {
    const getVacantTablesUrl = process.env.API_BASE.concat('/api/VacantTable')
    return this.axios.get(getVacantTablesUrl, {
      timeout: 50000
    }).then((Response) => {
      console.log('Response--', Response.data)
      return Response.data
    })
  }
}
export default new Axios()