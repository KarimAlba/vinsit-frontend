import instance from "./instance";

import authModule from "./auth";
import accountingActsModule from "./accounting-acts";
import accountingUpdsModule from "./accounting-upds";
import citiesModule from "./cities";
import clientsModule from "./clients";
import invoicesModule from "./invoices";
import ordersModule from "./orders";
import orderStatusModule from "./orderStatus";
import productsModule from "./products";
import placesModule from "./places";
import paymentDocumentsModule from "./payment-documents";


export default {
	auth: authModule(instance),
    accActs: accountingActsModule(instance),
    accUpds: accountingUpdsModule(instance),
    cities: citiesModule(instance),
    clients: clientsModule(instance),
    invoices: invoicesModule(instance),
    orders: ordersModule(instance),
    orderStatus: orderStatusModule(instance),
    products: productsModule(instance),
    places: placesModule(instance),
    payDoc: paymentDocumentsModule(instance),
};
