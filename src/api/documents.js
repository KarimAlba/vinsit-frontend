export default function (instance) {
    return {
        getDocuments(data) {
            return instance.get("api/v1/stock_document/", {
                params: data
            });
        },
        getDocument(id) {
            return instance.get(`api/v1/stock_document/${id}/`);
        },
        editDocument(id, data) {
            return instance.patch(`api/v1/stock_document/${id}/`, data);
        },
        createDocument(data) {
            return instance.post(`api/v1/stock_document/`, data);
        },
        deleteDocument(id) {
            return instance.delete(`api/v1/stock_document/${id}/`);
        },

        getDocumentsType() {
            return instance.get(`api/v1/stock_document_type/`);
        },
        getDocumentType(id) {
            return instance.get(`api/v1/stock_document_type/${id}/`);
        },
        updateDocumentType(id, data) {
            return instance.patch(`api/v1/stock_document_type/${id}/`, data);
        },
        createDocumentType(data) {
            return instance.post(`api/v1/stock_document_type/`, data);
        },
        deleteDocumentType(id) {
            return instance.delete(`api/v1/stock_document_type/${id}/`);
        },
    };
}
