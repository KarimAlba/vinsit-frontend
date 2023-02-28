export default [
    {
        path: '/recipients',
        name: 'recipients',
        component: () => import(/* webpackChunkName: recipients */ '@/views/recipients/Recipients.vue'),
        meta: {
            pageTitle: 'Получатели',
            breadcrumb: [
                {
                    text: 'Получатели',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/recipients/:id(\\d+)',
        name: 'recipient',
        component: () => import(/* webpackChunkName: recipients */ '@/views/recipients/Recipient.vue'),
        meta: {
            navActiveLink: 'recipients',
            breadcrumb: [
                {
                    text: 'Получатели',
                    to: "/recipients"
                },
                {
                    text: 'Получатель',
                    active: true,
                },
            ],
        },
    },
]
