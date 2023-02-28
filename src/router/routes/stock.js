export default [
    {
        path: '/stock/documents',
        name: 'stock-documents',
        component: () => import('@/views/stock/Documents.vue'),
        meta: {
            pageTitle: 'Простые документы',
        },
    },
    {
        path: '/stock/storage',
        name: 'stock-storage',
        component: () => import('@/views/stock/Storage.vue'),
        meta: {
            pageTitle: 'Адресное хранение',
        },
    }
]