import Instance from "./instance";

import authModule from "./auth";
import accountingActsModule from "./accounting-acts";
import accountingChecksModule from "./accounting-checks";
import accountingUpdsModule from "./accounting-upds";
import citiesModule from "./cities";
import clientsModule from "./clients";
import executorsModule from "./executors";
import invoicesModule from "./invoices";
import reconciliationActsModule from "./reconciliation-acts";
import ordersModule from "./orders";
import orderStatusModule from "./orderStatus";
import productsModule from "./products";
import placesModule from "./places";
import paymentDocumentsModule from "./payment-documents";
import servicesModule from "./services";

export const instance = new Instance().getAxiosIns();

export default {
	auth: authModule(instance),
    accActs: accountingActsModule(instance),
    checks: accountingChecksModule(instance),
    accUpds: accountingUpdsModule(instance),
    cities: citiesModule(instance),
    clients: clientsModule(instance),
    executors: executorsModule(instance),
    invoices: invoicesModule(instance),
    reconciliationActs: reconciliationActsModule(instance),
    orders: ordersModule(instance),
    orderStatus: orderStatusModule(instance),
    products: productsModule(instance),
    places: placesModule(instance),
    payDoc: paymentDocumentsModule(instance),
    services: servicesModule(instance),
};
