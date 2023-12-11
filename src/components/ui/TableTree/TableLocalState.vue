<template>
	<table-tree
		:data="data"
		:fields="fields"
		:actions="actions"
		:count="count"
		:per-page="perPage"
		:cur-page="curPage"
		@fetchData="fetchItems"
		@reset-pagination="resetPagination"
		@changePage="changeCurPage"
		@sortTable="sortTable"
	/>
</template>

<script>
import TableTree from "./TableTree.vue";

export default {
	name: "TableLocalState",
	components: { TableTree },
	props: {
		fetchData: {
			type: Function,
			default: () => {},
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
		perPage: {
			type: Number,
			default: () => 10,
		},
	},
	data() {
		return {
			data: [],
			ordering: '',
			count: 0,
			curPage: 1,
		};
	},
	methods: {
		sortTable(sortBy, sortDesc) {
            if (sortDesc) {
                this.changeOrdering(sortBy);
            } else {
                this.changeOrdering(`-${sortBy}`);
            };
			this.resetPagination();
            setTimeout(() => {
				this.fetchItems();
            }, 0);
        },
		changeCurPage(page) {
			this.curPage = page;
            this.fetchItems();
        },
		resetPagination() {
			this.curPage = 1;
		},
		changeOrdering(ordering) {
			this.ordering = ordering;
		},
		fetchItems() {
			this.fetchData({
				ordering: this.ordering,
				offset: ((this.curPage - 1) * this.perPage),
				limit: this.perPage,
			}).then((response) => {
				this.data = response.data.results;
				this.count = response.data.count;
            });
		},
	},
};
</script>

<style lang="scss"></style>
