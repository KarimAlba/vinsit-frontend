import { RoleConstants } from "@/utils/role";

export default [
	{
		title: 'Заказы',
		route: 'orders',
		icon: 'TruckIcon',
	},
	{
		title: 'Контрагенты',
		icon: 'UserCheckIcon',
		route: 'clients',
        meta: {
            disabledRoles: [
                RoleConstants.CR,
            ],
        },
	},
	{
		title: 'Склад',
		icon: 'PackageIcon',
        meta: {
            disabledRoles: [
                RoleConstants.CR,
            ],
        },
		children: [
            {
                title: 'Простые документы',
                icon: 'ChevronRightIcon',
                route: 'stock-documents',
            },
            {
                title: 'Адресное хранение',
                icon: 'ChevronRightIcon',
                route: 'stock-storage',
            },
            {
                title: 'Инвентаризация',
                icon: 'ChevronRightIcon',
                route: 'stock-inventarization',
            },
		],
	},
	{
		title: 'Курьеры',
		icon: 'UsersIcon',
		children: [
            {
                title: 'Журнал курьерских карт',
                icon: 'ChevronRightIcon',
                route: 'couriers-journal',
            },
            {
                title: 'Маршрутный лист',
                icon: 'ChevronRightIcon',
                route: 'couriers-routes',
            },
            {
                title: 'Курьеры',
                icon: 'ChevronRightIcon',
                route: 'couriers',
            },
            // {
            //     title: 'Полнота выдачи',
            //     icon: 'ChevronRightIcon',
            //     route: 'couriers-completeness',
            // },
		],
	},
	{
		title: 'Бухгалтерия',
		icon: 'FileTextIcon',
        meta: {
            disabledRoles: [
                ...Object.keys(RoleConstants).filter(key => key !== RoleConstants.AD),
            ],
        },
		children: [
            {
                title: 'Акт сверки взаиморасчетов',
                icon: 'ChevronRightIcon',
                route: 'accounting-reconciliation-act',
            },
            {
                title: 'Счет-фактура',
                icon: 'ChevronRightIcon',
                route: 'accounting-invoice',
            },
            {
                title: 'Акт',
                icon: 'ChevronRightIcon',
                route: 'accounting-act',
            },
            {
                title: 'Счета',
                icon: 'ChevronRightIcon',
                route: 'accounting-check',
            },
            {
                title: 'УПД',
                icon: 'ChevronRightIcon',
                route: 'accounting-upd',
            },
            {
                title: 'Пакет клиентских документов',
                icon: 'ChevronRightIcon',
                route: 'accounting-package-of-documents',
            },
            {
                title: 'Задолженности по заказам',
                icon: 'ChevronRightIcon',
                route: 'accounting-debt',
            },
            {
                title: 'Банк',
                icon: 'ChevronRightIcon',
                route: 'accounting-bank',
            },
        ],
    },
]
