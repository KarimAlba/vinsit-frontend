<template>
  <section class="orders">
    <b-overlay :show="loading" rounded="sm">
      <filter-orders />

      <block-orders />
    </b-overlay>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

import { BOverlay } from "bootstrap-vue";

import FilterOrders from "@/components/orders/FilterOrders";
import BlockOrders from "@/components/orders/BlockOrders";

export default {
  components: {
    BOverlay,

    FilterOrders,
    BlockOrders,
  },
  computed: {
    ...mapGetters({
      loading: "moduleOrders/getLoading",
    }),
  },
};
</script>
