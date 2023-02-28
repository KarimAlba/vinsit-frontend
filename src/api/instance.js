
import Vue from 'vue';
import axios from "axios";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";



const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    validateStatus: (status) => status < 500,
    withCredentials: false,
});

instance.interceptors.request.use((config) => {
    if (config.params) {
        Object.keys(config.params).forEach(
            (k) =>
                !config.params[k] &&
                config.params[k] !== undefined &&
                delete config.params[k]
        );
    }

    return config;
});

instance.interceptors.response.use(undefined, error => {
    const statusCode = error.response ? error.response.status : null;

    if (statusCode === 401) {
        // logout user
    }

    if (statusCode >= 500) {
        Vue.$toast(
            {
                component: ToastificationContent,
                props: {
                    title: "Ошибка",
                    text: "Ошибка при загрузке данных",
                    icon: "EditAlertCircle",
                    variant: "danger",
                },
            }
        )
    }

    if (statusCode === 400) {
        // show bad request error
    }

    return Promise.reject(error);
});


export default instance;
