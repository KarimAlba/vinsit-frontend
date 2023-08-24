export default function (instance) {
    return {
        getOffices(data) {
            return instance.get("api/v1/office/", {
                params: data
            });
        },
        getOfficeById(id) {
            return instance.get(`api/v1/office/${id}`);
        },
    };
}
