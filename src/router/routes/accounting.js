export default [
    {
        path: '/accounting/reconciliation-act',
        name: 'accounting-reconciliation-act',
        component: () => import('@/views/accounting/ReconciliationAct.vue'),
        meta: {
            pageTitle: 'Акт сверки взаиморасчетов',
        },
    },
    {
        path: '/accounting/invoice',
        name: 'accounting-invoice',
        component: () => import('@/views/accounting/Invoice.vue'),
        meta: {
            pageTitle: 'Счёт-фактура',
        },
    },
    {
        path: '/accounting/act',
        name: 'accounting-act',
        component: () => import('@/views/accounting/Act.vue'),
        meta: {
            pageTitle: 'Акт',
        },
    },
    {
        path: '/accounting/upd',
        name: 'accounting-upd',
        component: () => import('@/views/accounting/UPD.vue'),
        meta: {
            pageTitle: 'УПД',
        },
    },
    {
        path: '/accounting/package-of-documents',
        name: 'accounting-package-of-documents',
        component: () => import('@/views/accounting/PackageOfDocuments.vue'),
        meta: {
            pageTitle: 'Пакет клиентских документов',
        },
    },
    {
        path: '/accounting/debt',
        name: 'accounting-debt',
        component: () => import('@/views/accounting/Debt.vue'),
        meta: {
            pageTitle: 'Задолженности по заказам',
        },
    },

]