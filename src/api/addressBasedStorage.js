export default function (instance) {
    return {
        getStoredOrders(data) {
            return instance.get("api/v1/address_based_storage/cargo_registration", {
                params: data
            });
        },
        createStoredOrder(data) {
            return instance.post("api/v1/address_based_storage/cargo_registration/", data);
        },
        getStoredOrder(id) {
            return instance.get(`api/v1/address_based_storage/cargo_registration/${id}/`);
        },
        updateStoredOrder(id, data) {
            return instance.put(`api/v1/address_based_storage/cargo_registration/${id}/`, data);
        },
        editStoredOrder(id, data) {
            return instance.patch(`api/v1/address_based_storage/cargo_registration/${id}/`, data);
        },
        deleteStoredOrder(id) {
            return instance.delete(`api/v1/address_based_storage/cargo_registration/${id}/`);
        },
        getStoredOrderStatus() {
            return instance.get("api/v1/address_based_storage/cargo_registration_status/");
        },
        getStocks(data) {
            return instance.get("api/v1/stock", {
                params: data
            });
        },
        getZones(data) {
            return instance.get("api/v1/address_based_storage/zone", {
                params: data
            });
        },
        getRacks(data) {
            return instance.get("api/v1/address_based_storage/rack", {
                params: data
            });
        },
        getShelves(data) {
            return instance.get("api/v1/address_based_storage/shelf", {
                params: data
            });
        },
        deleteStock(id) {
            return instance.delete(`api/v1/stock/${id}`);
        },
        deleteZone(id) {
            return instance.delete(`api/v1/address_based_storage/zone/${id}`);
        },
        deleteRack(id) {
            return instance.delete(`api/v1/address_based_storage/rack/${id}`);
        },
        deleteShelf(id) {
            return instance.delete(`api/v1/address_based_storage/shelf/${id}`);
        },
        createStock(data) {
            return instance.post("api/v1/stock/", data);
        },
        createZone(data) {
            return instance.post("api/v1/address_based_storage/zone/", data);
        },
        createRack(data) {
            return instance.post("api/v1/address_based_storage/rack/", data);
        },
        createShelf(data) {
            return instance.post("api/v1/address_based_storage/shelf/", data);
        },
    }
}
