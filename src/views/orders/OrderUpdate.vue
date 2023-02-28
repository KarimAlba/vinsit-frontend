<template>
  <section class="order pb-5">
    <b-overlay :show="loading" rounded="sm">
      <h1 class="mb-3">Редактирование заказа</h1>

      <router-link
        class="d-block mb-2"
        :to="{ name: 'order', params: { id: order.id } }"
      >
        <feather-icon icon="ChevronLeftIcon" />
        Вернуться к заказу</router-link
      >

      <update-main v-if="order" :order="order" />

      <update-payer v-if="order" :order="order" />

      <update-sender v-if="order" :order="order" />

      <update-recipient v-if="order" :order="order" />

      <update-products
        v-if="order"
        :order="order.id"
        :products="order.order_products"
        v-model="order.order_products"
      />
    </b-overlay>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { BOverlay } from "bootstrap-vue";

import UpdateMain from "@/components/orders/update/UpdateMain.vue";
import UpdatePayer from "@/components/orders/update/UpdatePayer.vue";
import UpdateSender from "@/components/orders/update/UpdateSender.vue";
import UpdateRecipient from "@/components/orders/update/UpdateRecipient.vue";
import UpdateProducts from "@/components/orders/update/UpdateProducts.vue";

export default {
  components: {
    BOverlay,
    UpdateMain,
    UpdatePayer,
    UpdateSender,
    UpdateRecipient,
    UpdateProducts,
  },
  computed: {
    ...mapGetters({
      loading: "moduleOrders/getLoading",
      order: "moduleOrders/getOrder",

      orderStatus: "moduleOrders/getOrderStatus",
      orderMode: "moduleOrders/getOrderMode",
      orderType: "moduleOrders/getOrderType",
      placeStatus: "moduleOrders/getPlaceStatus",
    }),
    idOrder() {
      return this.$route.params.id || null;
    },
  },
  methods: {
    ...mapActions({
      fetchOrder: "moduleOrders/fetchOrder",
    }),
  },
  mounted() {
    this.fetchOrder(this.idOrder);
  },
};
</script>

<style lang="scss" scoped></style>
