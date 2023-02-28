export default [
    {
        path: '/payers',
        name: 'payers',
        component: () => import(/* webpackChunkName: payers */ '@/views/payers/Payers.vue'),
        meta: {
            pageTitle: 'Плательщики',
            breadcrumb: [
                {
                    text: 'Плательщики',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/payers/:id(\\d+)',
        name: 'payer',
        component: () => import(/* webpackChunkName: payers */ '@/views/payers/Payer.vue'),
        meta: {
            navActiveLink: 'payers',
            breadcrumb: [
                {
                    text: 'Плательщики',
                    to: "/payers"
                },
                {
                    text: 'Плательщик',
                    active: true,
                },
            ],
        },
    },
]
