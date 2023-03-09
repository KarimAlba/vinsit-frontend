<template>
	<v-select
		label="type"
		@change="changeOption"
		:options="types"
		:placeholder="placeholder"
		:filterable="false"
		:disabled="disabled"
		:reduce="reduce"
		v-model="inputVal"
	>
		<!-- <template #no-options="{ search }">
			{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
		</template> -->
	</v-select>
</template>

<script>
	import vSelect from "vue-select";
	import { debounce } from "lodash";

	export default {
		props: {
			placeholder: {
				type: String,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			reduce: {
				type: Function,
			},
			value: {
				type: [Number, String, Object],
			},
		},
		data() {
			return {
				types: [],
				type: null,
			};
		},
		components: {
			vSelect,
		},
		computed: {
			inputVal: {
				get() {
					console.log('tut');
					return this.value;
				},
				set(val) {
					console.log('tut');
					this.$emit("input", val);
				},
			},
		},
		methods: {
			onSearchTypes(search, loading) {
				console.log('tut');
				// if (search.length) {
				// loading(true);
				this.$emit("input", search);
				// this.fetchClients(search, loading, this);
				// };
			},
			// fetchTypes: _.debounce((search, loading, vm) => {
			// 	vm.$api.types.getClients({ search, limit: 100 }).then((response) => {
			// 		vm.types = response.data.results;
			// 		loading(false);
			// 	});
			// }, 500),
			changeOption(event) {
				console.log('tut');
				this.$emit("inputVal", event.target.value);
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
</style>
