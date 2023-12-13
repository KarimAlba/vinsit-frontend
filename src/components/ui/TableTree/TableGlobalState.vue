<template>
	<table-tree
		:data="data"
		:fields="fields"
		:actions="actions"
		:count="count"
		:per-page="perPage"
		:cur-page="curPage"
		@fetchData="$emit('fetchData')"
		@reset-pagination="$emit('resetPagination')"
		@changePage="changeCurPage"
		@sortTable="sortTable"
	/>
</template>

<script>
import TableTree from "./TableTree.vue";

export default {
	name: "TableGlobalState",
	components: { TableTree },
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		fields: {
			type: Array,
			default: () => [],
		},
		footFields: {
			type: Array,
			default: () => [],
		},
		actions: {
			type: Object,
			default: () => {},
		},
		count: {
			type: Number,
			default: () => 0,
		},
		perPage: {
			type: Number,
			default: () => 1,
		},
		curPage: {
			type: Number,
			default: () => 1,
		},
	},
	emits: [
		"fetchData",
		"changeOrdering",
		"changePage",
		"resetPagination",
	],
	methods: {
		sortTable(sortBy, sortDesc) {
            if (sortDesc) {
                this.$emit('changeOrdering', sortBy);
            } else {
                this.$emit('changeOrdering', `-${sortBy}`);
            };
            this.$emit('resetPagination');
            setTimeout(() => {
				this.$emit('fetchData');
            }, 0);
        },
		changeCurPage(page) {
            this.$emit('changePage', page);
            this.$emit('fetchData');
        },
	},
};
</script>

<style lang="scss"></style>
