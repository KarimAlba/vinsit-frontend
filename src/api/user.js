export default function (instance) {
    return {
        getUsers(data) {
            return instance.get("api/v1/user/", {
                params: data,
            });
        },
        async getUser(id) {
            const res = await instance.get(`api/v1/user/${id}/`);
            return res;
        },
        createUser(data) {
            return instance.post(`api/v1/user/`, data);
        },
        editUser(id, data) {
            return instance.patch(`api/v1/user/${id}/`, data);
        },
    }
}
