<template>
	<section class="orders">
		<b-overlay :show="loading" rounded="sm">
			<filter-bank />
			<block-bank />
		</b-overlay>
	</section>
</template>

<script>
	import { mapGetters } from "vuex";
	import { BOverlay } from "bootstrap-vue";
	import FilterBank from "@/components/accounting/FiltersBank.vue";
	import BlockBank from "@/components/accounting/BlockBank.vue";

	export default {
		components: {
			BOverlay,

			FilterBank,
			BlockBank,
		},
		computed: {
			...mapGetters({
				loading: "moduleOrders/getLoading",
			}),
		},
	};
</script>

<style lang="scss" scoped>
    .orders {
        padding-bottom: 50px;
    }
</style>