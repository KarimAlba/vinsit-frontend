import { RoleConstants } from '@/utils/role';

export default [
    {
        path: '/stock/documents',
        name: 'stock-documents',
        component: () => import('@/views/stock/Documents/Documents.vue'),
        meta: {
            pageTitle: 'Простые документы',
            disabledRoles: [
                RoleConstants.CR,
            ]
        },
    },
    {
        path: '/stock/documents/create/:type?/:id?',
        name: 'stock-document',
        component: () => import('@/views/stock/Documents/Document.vue'),
        meta: {
            pageTitle: 'Простые документы',
            disabledRoles: [
                RoleConstants.CR,
            ],
            breadcrumb: [
                {
                    text: 'Документы',
                    to: "/stock/documents"
                },
                {
                    text: 'Документ',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/stock/storage',
        name: 'stock-storage',
        component: () => import('@/views/stock/Storage/Storage.vue'),
        meta: {
            pageTitle: 'Адресное хранение',
            disabledRoles: [
                RoleConstants.CR,
            ]
        },
    },
    {
        path: '/stock/storage/stored-order/:id',
        name: 'stored-order',
        component: () => import('@/views/stock/Storage/StoredOrder.vue'),
        meta: {
            pageTitle: 'Адресное хранение', //тут наверное надо маршрут показать, а не title
            disabledRoles: [
                RoleConstants.CR,
            ]
        },
    },
    {
        path: '/stock/inventarization',
        name: 'stock-inventarization',
        component: () => import('@/views/stock/Inventarization/Inventarization.vue'),
        meta: {
            pageTitle: 'Инвентаризация',
            disabledRoles: [
                RoleConstants.CR,
            ],
        },
    },
    // {
    //     path: '/stock/storage/tab/:tabIndex',
    //     name: 'cargo-registration',
    //     component: () => import('@/views/stock/Storage/CargoRegistration.vue'),
    //     meta: {
    //         pageTitle: 'Регистрация груза',
    //         disabledRoles: [
    //             RoleConstants.CR,
    //         ]
    //     },
    // },
    // {
    //     path: '/stock/storage/tab/:tabIndex',
    //     name: 'warehouse-topology',
    //     component: () => import('@/views/stock/Storage/WarehouseTopology.vue'),
    //     meta: {
    //         pageTitle: 'Топология склада',
    //         disabledRoles: [
    //             RoleConstants.CR,
    //         ]
    //     },
    // }
]
