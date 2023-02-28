export default function (instance) {
    return {
        getUpds(data) {
            return instance.get("api/v1/upds/", {
                params: data
            });
        },
        getUpd(id) {
            return instance.get(`api/v1/upds/${id}/`);
        },
        getUpdPDF(id) {
            return instance.get(`api/v1/upds/${id}/generate_pdf/`);
        }
    };
}
