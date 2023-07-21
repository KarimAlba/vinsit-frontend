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
    }
]