import Vue from 'vue'
import VueRouter from 'vue-router'

//Routes
import accounting from './routes/accounting'
import clients from './routes/clients'
import couriers from './routes/couriers'
import common from './routes/common'
import orders from './routes/orders'
import payers from './routes/payers'
import recipients from './routes/recipients'
import senders from './routes/senders'
import stock from './routes/stock'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    ...accounting,
    ...clients,
    ...couriers,
    ...common,
    ...orders,
    ...payers,
    ...recipients,
    ...senders,
    ...stock,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
