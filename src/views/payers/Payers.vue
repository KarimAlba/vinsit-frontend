<template>
  <section class="orders">
    <b-overlay :show="loading" rounded="sm">
      <filter-payers />

      <block-payers />
    </b-overlay>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

import { BOverlay } from "bootstrap-vue";

import BlockPayers from "@/components/payers/BlockPayers";
import FilterPayers from "@/components/payers/FilterPayers";

export default {
  components: {
    BOverlay,

    BlockPayers,
    FilterPayers,
  },
  computed: {
    ...mapGetters({
      loading: "modulePayers/getLoading",
    }),
  },
};
</script>
