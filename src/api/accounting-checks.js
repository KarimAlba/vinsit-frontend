export default function (instance) {
    return {
        getChecks(data) {
            return instance.get("api/v1/checks/", {
                params: data
            });
        },
        getCheck(id) {
            return instance.get(`api/v1/checks/${id}/`);
        },
        getPDF(id) {
            return instance.get(`api/v1/checks/${id}/generate_pdf/`);
        }
    };
}
