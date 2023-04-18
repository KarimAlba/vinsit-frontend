import { RoleConstants } from '@/utils/role';

export default [
    {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/orders/Orders.vue'),
        meta: {
            pageTitle: 'Заказы',
            breadcrumb: [
                {
                    text: 'Заказы',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/orders/:id(\\d+)',
        name: 'order',

        component: () => import('@/views/orders/Order.vue'),
        meta: {
            navActiveLink: 'orders',
            breadcrumb: [
                {
                    text: 'Заказы',
                    to: "/orders"
                },
                {
                    text: 'Заказ',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/orders/:id(\\d+)/edit',
        name: 'order-edit',
        component: () => import('@/views/orders/OrderUpdate.vue'),
        meta: {
            navActiveLink: 'orders',
            breadcrumb: [
                {
                    text: 'Заказы',
                    to: "/orders"
                },
                {
                    text: 'Заказ',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/orders/new',
        name: 'order-create',
        component: () => import('@/views/orders/OrderCreate.vue'),
        meta: {
            pageTitle: 'Заказы',
            breadcrumb: [
                {
                    text: 'Заказы',
                    to: "/orders"
                },
                {
                    text: 'Новый заказ',
                    active: true,
                },
            ],
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => (key !== RoleConstants.AD) && (key !== RoleConstants.LG))
            ],
        },
    },
]
