export default function (instance) {
    return {
        getPaymentDocuments(data) {
            return instance.get("api/v1/payment_documents/", {
                params: data
            });
        },
        createPaymentDocuments(data) {
            return instance.post("api/v1/payment_documents/", data);
        },
    };
}
