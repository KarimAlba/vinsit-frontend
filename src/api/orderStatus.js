export default function (instance) {
    return {
        getOrderStatusList(data) {
            return instance.get("api/v1/order_status/", {
                params: data
            });
        },
    };
}
