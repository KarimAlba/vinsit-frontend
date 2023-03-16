export default function (instance) {
    return {
        getExecutors(data) {
            return instance.get("api/v1/executor/", {
                params: data,
            });
        },
        async getExecutor(id) {
            const res = await instance.get(`api/v1/executor/${id}/`);
            return res;
        },
    };
}
