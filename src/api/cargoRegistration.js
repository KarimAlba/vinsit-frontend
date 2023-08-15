export default function (instance) {
    return {
        getOrders(data) {
            return instance.get("api/v1/address_based_storage/cargo_registration", {
                params: data
            });
        },
        createOrder(data) {
            return instance.post("api/v1/address_based_storage/cargo_registration", data);
        },
        getOrder(id) {
            return instance.get(`api/v1/address_based_storage/cargo_registration/${id}/`);
        },
        updateOrder(id, data) {
            return instance.put(`api/v1/address_based_storage/cargo_registration/${id}/`, data);
        },
        editOrder(id, data) {
            return instance.patch(`api/v1/address_based_storage/cargo_registration/${id}/`, data);
        },
        deleteOrder(id) {
            return instance.delete(`api/v1/address_based_storage/cargo_registration/${id}/`);
        },
        getStatus() {
            return instance.get("api/v1/address_based_storage/cargo_registration_status");
        }
    }
}