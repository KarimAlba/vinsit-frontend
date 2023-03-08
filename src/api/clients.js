export default function (instance) {
    return {
        getClients(data) {
            return instance.get("api/v1/clients/", {
                params: data,
            });
        },
        getClient(id) {
            return instance.get(`api/v1/clients/${id}/`);
        },
        deleteClient(id) {
            return instance.delete(`api/v1/clients/${id}/`);
        },
    };
}
