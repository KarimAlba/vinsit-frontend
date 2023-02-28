export default [
    {
        path: '/',
        name: 'home',
        redirect: to => {
            return { name: 'orders' }
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: {
            layout: 'full',
        },
    },
    {
        path: '/error-404',
        name: 'error-404',
        component: () => import('@/views/error/Error404.vue'),
        meta: {
            layout: 'full',
        },
    },
]