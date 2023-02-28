export default function (instance) {
    return {
        getProducts(data) {
            return instance.get("api/v1/product/", {
                params: data
            });
        },
        getProduct(id) {
            return instance.get(`api/v1/product/${id}/`);
        },
        updateProduct(id, data) {
            return instance.patch(`api/v1/product/${id}/`, data);
        },
        createProduct(data) {
            return instance.post(`api/v1/product/`, data);
        },
        deleteProduct(id) {
            return instance.delete(`api/v1/product/${id}/`);
        }
    };
}
