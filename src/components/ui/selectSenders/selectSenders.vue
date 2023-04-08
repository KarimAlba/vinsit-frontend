<template>
	<v-select
		label="full_name"
		@search="onSearchSenders"
		@input="input"
		:options="senders"
		:placeholder="placeholder"
		:filterable="false"
		:disabled="disabled"
		:reduce="reduce"
	>
		<template #no-options="{ search }">
			{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
		</template>
	</v-select>
</template>

<script>

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
	},
	data() {
		return {
			senders: [],
		};
	},
	components: {
		vSelect,
	},
	methods: {
		onSearchSenders(search, loading) {
		if (search.length) {
			loading(true);
			this.fetchSenders(search, loading, this);
		}
		},
		fetchSenders: _.debounce((search, loading, vm) => {
			vm.$api.senders.getSenders({ search, limit: 100 }).then((response) => {
			vm.senders = response.data.results;
			loading(false);
		});
		}, 500),
		input(sender) {
			this.$emit("input", sender);
		},
	},
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
