<template>
	<b-tabs content-class="mt-3">
		<b-tab title="Регистрация груза" active>
			<CargoRegistration/>
		</b-tab>
		<b-tab title="Топология склада">
			<WarehouseTopology/>
		</b-tab>
	</b-tabs>
</template>

<script>
	import { getHomeRouteForLoggedInUser } from '@/auth/utils';
import CargoRegistration from './CargoRegistration.vue';
	import WarehouseTopology from './WarehouseTopology.vue';
	import {
		BTab,
		BTabs,
	} from "bootstrap-vue";

	export default {
		data() {
			return {
			};
		},
		components: {
			CargoRegistration,
			WarehouseTopology,
			BTab,
			BTabs,
		},
		watch: {
		},
		computed: {
		},
		methods: {
		},
		mounted() {
		},
	};
</script>

<style lang="scss" scoped>

	.currentTab {
		border-bottom: 2px solid #EF3124;
	}
</style>
