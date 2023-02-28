export default function (instance) {
    return {
        getCities(data) {
            return instance.get("api/v1/city/", {
                params: data
            });
        },
        getCitiesById(data) {
            return instance.post("api/v1/city/by_ids/", data);
        },
    };
}
