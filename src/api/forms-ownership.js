export default function (instance) {
    return {
        getFormsOwnership() {
            return instance.get("api/v1/form_of_ownership/");
        },
    }
}
