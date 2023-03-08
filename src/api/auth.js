export default function (instance) {
    return {
        signIn(full_name, password) {
            return instance.post("api/v1/login/", {
				full_name,
				password,
            });
        },
		refresh(refresh) {
			return instance.post("api/v1/login/refresh", {
				refresh,
			})
		},
        signUp(data) {
            return instance.post("api/v1/register/", data);
        },
		logout(refresh_token) {
			return instance.post("api/v1/logout/", {
				refresh_token,
			});
		}
    };
}
