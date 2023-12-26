export default [
    {
        path: '/couriers/journal/journal',
        name: 'couriers-journal',
        component: () => import('@/views/couriers/Journal/Journal.vue'),
        meta: {
            pageTitle: 'Журнал курьерских карт',
        },
    },
    {
        path: '/couriers/routes/:idMap?',
        name: 'couriers-routes',
        component: () => import('@/views/couriers/RoutesSheet/RoutesSheet.vue'),
        meta: {
            pageTitle: 'Маршрутный лист',
        },
    },
    {
        path: '/couriers/couriers',
        name: 'couriers',
        component: () => import('@/views/couriers/Couriers.vue'),
        meta: {
            pageTitle: 'Курьеры',
        },
    },
    {
        path: '/couriers/completeness',
        name: 'couriers-completeness',
        component: () => import('@/views/couriers/Completeness.vue'),
        meta: {
            pageTitle: 'Полнота выдачи',
        },
    },
]