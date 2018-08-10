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
    const loginUrl = url.concat(username, name, userpassword, pass)
    // const loginUrl = 'http://47.23.106.203/kottab/api/Login?Username=staff&Password=svt1234'
    return this.axios.get(loginUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  getOccupiedTables () {
    const getOccupiedTablesUrl = process.env.API_BASE.concat('/api/OccupiedTable')
    return this.axios.get(getOccupiedTablesUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  getVacantTables () {
    const getVacantTablesUrl = process.env.API_BASE.concat('/api/VacantTable')
    return this.axios.get(getVacantTablesUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  getFoodItemList () {
    const getFoodItemListUrl = process.env.API_BASE.concat('/api/Items')
    return this.axios.get(getFoodItemListUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  getFilteredItemList (key) {
    if (key) {
      const beforeUrl = process.env.API_BASE.concat('/api/Items?term=')
      const getFilterFoodListUrl = beforeUrl.concat(key)
      return this.axios.get(getFilterFoodListUrl, {
        timeout: 50000
      }).then((Response) => {
        return Response.data
      })
    }
  }
  getWaiterList () {
    const getWaiterUrl = process.env.API_BASE.concat('/api/WaiterList')
    return this.axios.get(getWaiterUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  placeOrder (payload) {
    return this.axios.request({
      method: 'POST',
      url: process.env.API_BASE.concat('/api/SaveOrder'),
      responseType: 'json',
      data: payload,
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  fetchActiveOrderList (tableNumber) {
    const fetchActiveOrderListUrl = process.env.API_BASE.concat('/api/ActiveOrderDetails?tableid=').concat(tableNumber)
    console.log('fetchActiveOrderListUrl', fetchActiveOrderListUrl)
    return this.axios.get(fetchActiveOrderListUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  addItemToActiveOrder (payload) {
    return this.axios.request({
      method: 'POST',
      url: process.env.API_BASE.concat('/api/AddItemToActiveOrder'),
      responseType: 'json',
      data: payload,
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  updateTableStatus (tableNumber) {
    return this.axios.request({
      method: 'GET',
      url: process.env.API_BASE.concat('/api/UpdateTableStatus?tableId=').concat(tableNumber).concat('&tableStatus=O'),
      responseType: 'json',
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  sendForPayment (tableNumber) {
    return this.axios.request({
      method: 'GET',
      url: process.env.API_BASE.concat('/api/UpdateTableStatus?tableId=').concat(tableNumber).concat('&tableStatus=P'),
      responseType: 'json',
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  printOrders (payload) {
    return this.axios.request({
      method: 'POST',
      // url: process.env.API_BASE.concat('')
      url: 'http://192.168.31.110/kottab/api/PrintKOT',
      responseType: 'json',
      data: payload,
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  fetchPrinterList () {
    const fetchPrinterListUrl = process.env.API_BASE.concat('/api/PrinterSettings')
    return this.axios.get(fetchPrinterListUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  updatePrinterdata (payload) {
    return this.axios.request({
      method: 'PUT',
      url: process.env.API_BASE.concat('/').concat(payload),
      responseType: 'json',
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  DeletePrinterdata (payload) {
    return this.axios.request({
      method: 'DELETE',
      url: process.env.API_BASE.concat('/').concat(payload),
      responseType: 'json',
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  addPrinterData (payload) {
    return this.axios.request({
      method: 'POST',
      url: process.env.API_BASE.concat('/').concat(payload),
      responseType: 'json',
      headers: {
        'content-type': 'application/json'
      }
    })
  }
}
export default new Axios()
