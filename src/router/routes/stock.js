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
        path: '/stock/documents/create',
        name: 'create-stock-document',
        component: () => import('@/views/stock/Documents/CreateDocument.vue'),
        meta: {
            pageTitle: 'Простые документы',
            disabledRoles: [
                RoleConstants.CR,
            ]
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