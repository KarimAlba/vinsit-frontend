<template>
    <section class="orders">
        <b-overlay :show="loading" rounded="sm">
            <filter-clients />

            <block-clients />
        </b-overlay>
    </section>
</template>

<script>
import { mapGetters } from "vuex";

import { BOverlay } from "bootstrap-vue";

import BlockClients from "@/components/clients/BlockClients";
import FilterClients from "@/components/clients/FilterClients";

export default {
    components: {
        BOverlay,

        BlockClients,
        FilterClients,
    },
    computed: {
        ...mapGetters({
            loading: "moduleClients/getLoading",
        }),
    },
};
</script>
