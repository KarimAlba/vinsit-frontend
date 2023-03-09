<template>
	<section class="orders">
		<b-overlay :show="loading" rounded="sm">
			<filter-recipients />

			<block-recipients />
		</b-overlay>
	</section>
</template>

<script>
import { mapGetters } from "vuex";
import { BOverlay } from "bootstrap-vue";
import BlockRecipients from "@/components/recipients/BlockRecipients";
import FilterRecipients from "@/components/recipients/FilterRecipients";

export default {
	components: {
		BOverlay,
		BlockRecipients,
		FilterRecipients,
	},
	computed: {
		...mapGetters({
			loading: "moduleRecipients/getLoading",
		}),
	},
};
</script>
