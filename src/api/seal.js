export default function (instance) {
    return {
        getSeals(data) {
            return instance.get("api/v1/address_based_storage/seal/", {
                params: data
            });
        },
        getSealById(id) {
            return instance.get(`api/v1/address_based_storage/seal/${id}`);
        },
    };
}
