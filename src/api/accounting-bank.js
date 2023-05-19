export default function (instance) {
    return {
        getPaymentOrders(data) {
            return instance.get("api/v1/bank/payment_order/", {
                params: data
            });
        },
        createPaymentOrder(data) {
            return instance.post(`api/v1/bank/payment_order/`, data);
        },
        getPaymentOrder(id) {
            return instance.get(`api/v1/bank/payment_order/${id}/`);
        },
        getCheckingAccounts(data) {
            return instance.get("api/v1/bank/checking_accounts/", {
                params: data
            });
        },
        getFinancialTransactions(data) {
            return instance.get("api/v1/bank/financial_transactions/", {
                params: data
            });
        },
        updatePaymentOrder(id, data) {
            return instance.put(`api/v1/bank/payment_order/${id}/`, data);
        },
    };
}