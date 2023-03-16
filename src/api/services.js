export default function (instance) {
    return {
        getServices(limit, offset) {
            return instance.get("api/v1/service/", {
                params: {
                    limit,
                    offset,
                }
            });
        },
    };
}