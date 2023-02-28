import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import moduleClients from './app-modules/clients'
import moduleOrders from './app-modules/orders'
import moduleInvoices from './app-modules/accounting/invoices'
import moduleAccountingActs from './app-modules/accounting/acts'
import moduleAccountingUpds from './app-modules/accounting/upds'
import modulePayers from './app-modules/payers'
import moduleRecipients from './app-modules/recipients'
import moduleSenders from './app-modules/senders'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    moduleClients,
    moduleOrders,
    moduleInvoices,
    moduleAccountingActs,
    moduleAccountingUpds,
    modulePayers,
    moduleRecipients,
    moduleSenders
  },
  strict: process.env.DEV,
})
