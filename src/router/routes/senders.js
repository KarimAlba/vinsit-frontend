export default [
    {
        path: '/senders',
        name: 'senders',
        component: () => import(/* webpackChunkName: senders */ '@/views/senders/Senders.vue'),
        meta: {
            pageTitle: 'Отправители',
            breadcrumb: [
                {
                    text: 'Отправители',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/senders/:id(\\d+)',
        name: 'sender',
        component: () => import(/* webpackChunkName: senders */ '@/views/senders/Sender.vue'),
        meta: {
            navActiveLink: 'senders',
            breadcrumb: [
                {
                    text: 'Отправители',
                    to: "/senders"
                },
                {
                    text: 'Отправитель',
                    active: true,
                },
            ],
        },
    },
]
