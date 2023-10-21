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
    }
}
