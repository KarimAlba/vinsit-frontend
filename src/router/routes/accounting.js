import { RoleConstants } from '@/utils/role';

export default [
    {
        path: '/accounting/reconciliation-act',
        name: 'accounting-reconciliation-act',
        component: () => import('@/views/accounting/ReconciliationAct.vue'),
        meta: {
            pageTitle: 'Акт сверки взаиморасчетов',
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => key !== RoleConstants.AD)
            ],
        },
    },
    {
        path: '/accounting/invoice',
        name: 'accounting-invoice',
        component: () => import('@/views/accounting/Invoice.vue'),
        meta: {
            pageTitle: 'Счёт-фактура',
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => key !== RoleConstants.AD)
            ],
        },
    },
    {
        path: '/accounting/act',
        name: 'accounting-act',
        component: () => import('@/views/accounting/Act.vue'),
        meta: {
            pageTitle: 'Акт',
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => key !== RoleConstants.AD)
            ],
        },
    },
    {
        path: '/accounting/checks',
        name: 'accounting-check',
        component: () => import('@/views/accounting/Check.vue'),
        meta: {
            pageTitle: 'Чеки',
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => key !== RoleConstants.AD)
            ],
        },
    },
    {
        path: '/accounting/upd',
        name: 'accounting-upd',
        component: () => import('@/views/accounting/UPD.vue'),
        meta: {
            pageTitle: 'УПД',
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => key !== RoleConstants.AD)
            ],
        },
    },
    {
        path: '/accounting/package-of-documents',
        name: 'accounting-package-of-documents',
        component: () => import('@/views/accounting/PackageOfDocuments.vue'),
        meta: {
            pageTitle: 'Пакет клиентских документов',
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => key !== RoleConstants.AD)
            ],
        },
    },
    {
        path: '/accounting/debt',
        name: 'accounting-debt',
        component: () => import('@/views/accounting/Debt.vue'),
        meta: {
            pageTitle: 'Задолженности по заказам',
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => key !== RoleConstants.AD)
            ],
        },
    },

]