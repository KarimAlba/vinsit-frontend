export default function (instance) {
    return {
        getOrders(data) {
            return instance.get("api/v1/order/", {
                params: data
            });
        },
        getOrder(id) {
            return instance.get(`api/v1/order/${id}/`);
        },
        updateOrder(id, data) {
            return instance.patch(`api/v1/order/${id}/`, data);
        },
        createOrder(data) {
            return instance.post(`api/v1/order/`, data);
        },
        deleteOrder(id) {
            return instance.delete(`api/v1/order/${id}/`);
        },
        getOrderHistory(id) {
            return instance.get(`api/v1/order/${id}/history/`);
        },
    };
}
