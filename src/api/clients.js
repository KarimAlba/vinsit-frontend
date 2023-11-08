export default function (instance) {
    return {
        getClients(data) {
            return instance.get("api/v1/clients/", {
                params: data,
            });
        },
        async getClient(id) {
            const res = await instance.get(`api/v1/clients/${id}/`);
            return res;
        },
        changeClient(id, body) {
            return instance.patch(`api/v1/clients/${id}/`, body);
        },
        updateClient(id, body) {
            return instance.put(`api/v1/clients/${id}/`, body);
        },
        deleteClient(id) {
            return instance.delete(`api/v1/clients/${id}/`);
        },
		addNewClient(data) {
			return instance.post("api/v1/clients/", data);
		},
        getClientContracts(id) {
            return instance.get(`api/v1/clients/${id}/contracts/`);
        },
        createClientContract(id, contract) {
            return instance.post(`api/v1/clients/${id}/create_contract/`, {
                contract,
            });
        },
    };
}
