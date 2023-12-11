export default function (instance) {
    return {
        getCourierMaps(data) {
            return instance.get("api/v1/courier/map/", {
                params: data
            });
        },
        getCourierMap(id) {
            return instance.get(`api/v1/courier/map/${id}/`);
        },
        editCourierMap(id, data) {
            return instance.patch(`api/v1/courier/map/${id}/`, data);
        },
        createCourierMap(data) {
            return instance.post(`api/v1/courier/map/`, data);
        },
        deleteCourierMap(id) {
            return instance.delete(`api/v1/courier/map/${id}/`);
        },
        getCourierGroups(data) {
            return instance.get("api/v1/courier/group/", {
                params: data
            });
        },
        getCourierGroup(id) {
            return instance.get(`api/v1/courier/group/${id}/`);
        },
        getCourierMacrozones(data) {
            return instance.get("api/v1/courier/macrozone/", {
                params: data
            });
        },
        getCourierMacrozone(id) {
            return instance.get(`api/v1/courier/macrozone/${id}/`);
        },
    };
}
