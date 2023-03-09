<template>
	<section class="orders">
		<b-overlay :show="loading" rounded="sm">
			<filter-senders />

			<block-senders />
		</b-overlay>
	</section>
</template>

<script>
import { mapGetters } from "vuex";
import { BOverlay } from "bootstrap-vue";
import BlockSenders from "@/components/senders/BlockSenders";
import FilterSenders from "@/components/senders/FilterSenders";

export default {
	components: {
		BOverlay,

		BlockSenders,
		FilterSenders,
	},
	computed: {
		...mapGetters({
		loading: "moduleSenders/getLoading",
		}),
	},
};
</script>
