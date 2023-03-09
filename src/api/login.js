export default function (instance) {
    return {
        login(data) {
            return instance.post(`api/v1/login/`, data);
        },
    };
}