export default function (instance) {
    return {
        getReconciliationActs(params) {
            return instance.get("api/v1/reconciliation_act/", { params });
        },
        getReconciliationActById(id) {
            return instance.get(`api/v1/reconciliation_act/${id}/`);
        },
        createReconciliationAct(data) {
            return instance.post(`api/v1/reconciliation_act/`, data);
        },
        getReconciliationActPDF(id) {
            return instance.get(`api/v1/reconciliation_act/${id}/generate_pdf/`);
        }
    };
}
