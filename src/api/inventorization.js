export default function(instance) {
    return {
        getInventorizationItems(data) {
            return instance.get("api/v1/address_based_storage/cargo_registration/inventorization/", {
                params: data,
            });
        },
    };
}
