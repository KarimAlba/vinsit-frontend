export default function (instance) {
    return {
        registration(data) {
            return instance.post(`api/v1/register/`, data);
        },
    };
}