export default function(instance) {
    return {
        getInventorizations(data) {
            return instance.get("api/v1/inventorization/", {
                params: data,
            });
        },
		getInventorizationById(id) {
            return instance.get(`api/v1/inventorization/${id}/`);
        },
		addNewInventorization(data) {
			return instance.post("api/v1/inventorization/", data);
		},
		changeInventorization(id, body) {
            return instance.patch(`api/v1/inventorization/${id}/`, body);
        },
        updateInventorization(id, body) {
            return instance.put(`api/v1/inventorization/${id}/`, body);
        },
        deleteInventorization(id) {
            return instance.delete(`api/v1/inventorization/${id}/`);
        },
		updateInventorizationStatus(id, body) {
			return instance.post(`api/v1/inventorization/${id}/scan_order/`, body);
		},
		getInventorizationItems(data) {
			return instance.get("api/v1/inventorization-item/", {
                params: data,
            });
		},
		getInventorizationItemsById(id) {
            return instance.get(`api/v1/inventorization-item/${id}/`);
        },
		changeInventorizationItems(id, body) {
            return instance.patch(`api/v1/inventorization-item/${id}/`, body);
        },
        updateInventorizationItems(id, body) {
            return instance.put(`api/v1/inventorization-item/${id}/`, body);
        },
        deleteInventorizationItems(id) {
            return instance.delete(`api/v1/inventorization-item/${id}/`);
        },
		exportCSV(id) {
            return instance.get(`api/v1/inventorization/${id}/export_csv/`);
		},
    };
}
