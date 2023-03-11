<template>
	<v-select
		label="name"
		@input="input"
		:options="items"
		:placeholder="placeholder"
		:reduce="reduce"
		:search="false"
	/>
</template>

<script>
	import vSelect from "vue-select";

	export default {
		props: {
			placeholder: {
				type: String,
			},
			reduce: {
				type: Function,
			},
			items: {
				type: Array,
			},
		},
		data() {
			return {
				type: null,
			};
		},
		components: {
			vSelect,
		},
		methods: {
			input(type) {
				this.$emit("input", type);
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
</style>
