import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import app from './app';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';
import moduleClients from './app-modules/clients';
import moduleOrders from './app-modules/orders';
import moduleDocuments from './app-modules/documents';
import moduleInvoices from './app-modules/accounting/invoices';
import moduleReconciliationActs from './app-modules/accounting/reconciliation-acts';
import moduleAccountingActs from './app-modules/accounting/acts';
import moduleAccountingChecks from './app-modules/accounting/checks';
import moduleAccountingUpds from './app-modules/accounting/upds';
import moduleAccountingBank from './app-modules/accounting/bank';
import modulePayers from './app-modules/payers';
import moduleRecipients from './app-modules/recipients';
import moduleSenders from './app-modules/senders';
import moduleCargoRegistration from './app-modules/addressBasedStorage/cargoRegistration';
import moduleWarehouseTopology from './app-modules/addressBasedStorage/warehouseTopology';
import moduleCouriers from './app-modules/couriers'
import moduleRoutesSheet from './app-modules/routesSeet'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		app,
		appConfig,
		verticalMenu,
		moduleClients,
		moduleOrders,
		moduleDocuments,
		moduleInvoices,
        moduleReconciliationActs,
		moduleAccountingActs,
        moduleAccountingChecks,
		moduleAccountingUpds,
		moduleAccountingBank,
		modulePayers,
		moduleRecipients,
		moduleSenders,
		moduleCargoRegistration,
		moduleWarehouseTopology,
		moduleCouriers,
		moduleRoutesSheet,
  	},
  	strict: process.env.DEV,
});
