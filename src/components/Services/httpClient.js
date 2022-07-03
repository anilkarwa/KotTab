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
  getFoodItemList (key) {
    const getFoodItemListUrl = process.env.API_BASE.concat('/api/Items?tableId=').concat(key)
    return this.axios.get(getFoodItemListUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  getFilteredItemList (searchkey, tableId, categoryId) {
    if (searchkey && tableId) {
      // const getFilterFoodListUrl = process.env.API_BASE.concat('/api/Items?term=').concat(searchkey).concat('&tableId=').concat(tableId)
      const getFilterFoodListUrl = process.env.API_BASE.concat('/api/Items?term=').concat(searchkey).concat('&tableId=').concat(tableId).concat(`&itemGroupId=0`)
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
      url: process.env.API_BASE.concat('/api/PrintKOT'),
      // url: 'http://192.168.31.110/kottab/api/PrintKOT',
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
  getKcatId () {
    const fetchKcatIdUrl = process.env.API_BASE.concat('/api/KOTCATList')
    return this.axios.get(fetchKcatIdUrl, {
      timeout: 50000
    }).then((Response) => {
      return Response.data
    })
  }
  getFoodAreaId () {
    const fetchFoodAreaIdUrl = process.env.API_BASE.concat('/api/FoodAreaList')
    return this.axios.get(fetchFoodAreaIdUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  fetchPendingPaymentTables () {
    const fetchPendingPaymentTablesUrl = process.env.API_BASE.concat('/api/PaymentTable')
    return this.axios.get(fetchPendingPaymentTablesUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  filterVacantTables (key) {
    const filterVacantTablesUrl = process.env.API_BASE.concat('/api/SearchVacantTable?term=').concat(key)
    return this.axios.get(filterVacantTablesUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  filterOccupiedTables (key) {
    const filterOccupiedTablesUrl = process.env.API_BASE.concat('/api/SearchOccupiedTable?term=').concat(key)
    return this.axios.get(filterOccupiedTablesUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  filterPendingPaymentTables (key) {
    const filterPendingPaymentTablesUrl = process.env.API_BASE.concat('/api/SearchPaymentTable?term=').concat(key)
    return this.axios.get(filterPendingPaymentTablesUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  cancelActiveOrderQuantity (KOTNO, itemId, quantityNo) {
    const cancelActiveOrderQuantityUrl = process.env.API_BASE.concat('/api/CancelItemQuantity?KOTNO=').concat(KOTNO).concat('&itemId=').concat(itemId).concat('&quantityNo=').concat(quantityNo)
    return this.axios.get(cancelActiveOrderQuantityUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  merageTables (oldTableId, newTableId) {
    const merageTableUrl = process.env.API_BASE.concat('/api/ShiftToNewTable?oldTableId=').concat(oldTableId).concat('&newTableId=').concat(newTableId).concat('&shifType=merge')
    return this.axios.get(merageTableUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  fetchTableCount () {
    const fetchTableCountUrl = process.env.API_BASE.concat('/api/TableCount')
    return this.axios.get(fetchTableCountUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  transferTable (oldTableId, newTableId) {
    const transferTableUrl = process.env.API_BASE.concat('/api/ShiftToNewTable?oldTableId=').concat(oldTableId).concat('&newTableId=').concat(newTableId).concat('&shifType=shift')
    return this.axios.get(transferTableUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  printKOT (tableId, cap) {
    const printKOTURL = process.env.API_BASE.concat(`/api/PrintKOT?cap=${cap}&tableId=`).concat(tableId).concat('&print=Y&reprint=N&cancelled=N')
    return this.axios.get(printKOTURL, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  rePrintKOT (tableId, cap) {
    const rePrintKOTURL = process.env.API_BASE.concat(`/api/PrintKOT?cap=${cap}&tableId=`).concat(tableId).concat('&print=N&reprint=Y&cancelled=N')
    return this.axios.get(rePrintKOTURL, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  cancelPrintKOT (KCATID, KOTNO, itemName, cancelledQty, tableName, wtrId, PAX, cap) {
    const cancelPrintKOTURL = process.env.API_BASE.concat(`/api/CancellSingleItemPrint?cap=${cap}&KCATID=`).concat(KCATID).concat('&KOTNO=').concat(KOTNO).concat('&itemName=').concat(itemName).concat('&cancelledQty=').concat(cancelledQty).concat('&tableName=').concat(tableName).concat('&wtrId=').concat(wtrId).concat('&PAX=').concat(PAX)
    return this.axios.get(cancelPrintKOTURL, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  fetchItemCategory () {
    const fetchItemCategoryURL = process.env.API_BASE.concat('/api/ItemMenuGroupList')
    return this.axios.get(fetchItemCategoryURL, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  fetchItemByCategory (tableId, categoryId) {
    const fetchItemByCategoryURL = process.env.API_BASE.concat('/api/Items?tableId=').concat(tableId).concat('&itemGroupId=').concat(categoryId)
    return this.axios.get(fetchItemByCategoryURL, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  fetchPrintFormat () {
    const fetchPrintFormatUrl = process.env.API_BASE.concat('/api/PrintFormat')
    return this.axios.get(fetchPrintFormatUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
  updatePrintFormat (payload) {
    return this.axios.request({
      method: 'PUT',
      url: process.env.API_BASE.concat('/api/PrintFormat'),
      data: payload,
      responseType: 'json',
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  checkAllPrinterStatus () {
    const checkAllPrinterStatusUrl = process.env.API_BASE.concat('/api/CheckAllPrinterAddStatus')
    return this.axios.get(checkAllPrinterStatusUrl, {
      timeout: 50000
    }).then(response => {
      return response.data
    })
  }
}
export default new Axios()
