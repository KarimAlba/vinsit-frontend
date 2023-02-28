export default function (instance) {
    return {
        getInvoices(data) {
            return instance.get("api/v1/invoices/", {
                params: data
            });
        },
        getInvoice(id) {
            return instance.get(`api/v1/invoices/${id}/`);
        },
        getInvoicePDF(id) {
            return instance.get(`api/v1/invoices/${id}/generate_pdf/`);
        }
    };
}
