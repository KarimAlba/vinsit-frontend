export default function (instance) {
    return {
        getServices(offset, limit) {
            return instance.get("api/v1/service/", {
                params: {
                    limit,
                    offset,
                }
            });
        },
    };
}