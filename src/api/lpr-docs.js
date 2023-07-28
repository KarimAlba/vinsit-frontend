export default function (instance) {
    return {
        getLprDocs(data) {
            return instance.get("api/v1/lpr_docs/", {
                params: data,
            });
        },
        async getLprDocsById(id) {
            const res = await instance.get(`api/v1/lpr_docs/${id}/`);
            return res;
        },
        addNewLprDocs(data) {
			return instance.post("api/v1/lpr_docs/", data);
		},
        changeLprDocsById(id, body) {
            return instance.patch(`api/v1/lpr_docs/${id}/`, body);
        },
        deleteLprDocsById(id) {
            return instance.delete(`api/v1/lpr_docs/${id}/`);
        },
    };
}
