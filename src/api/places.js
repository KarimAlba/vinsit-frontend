export default function (instance) {
    return {
        getPlaces(data) {
            return instance.get("api/v1/place/", {
                params: data
            });
        },
        getPlace(id) {
            return instance.get(`api/v1/place/${id}/`);
        },
        updatePlace(id, data) {
            return instance.patch(`api/v1/place/${id}/`, data);
        },
        createPlace(data) {
            return instance.post(`api/v1/place/`, data);
        },
        deletePlace(id) {
            return instance.delete(`api/v1/place/${id}/`);
        }
    };
}
