export default function (instance) {
    return {
        getActs(data) {
            return instance.get("api/v1/acts/", {
                params: data
            });
        },
        getAct(id) {
            return instance.get(`api/v1/acts/${id}/`);
        },
        getActPDF(id) {
            return instance.get(`api/v1/acts/${id}/generate_pdf/`);
        }
    };
}
