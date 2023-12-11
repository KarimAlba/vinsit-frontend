<template>
	<div>
		<b-table-simple striped responsive>
			<b-thead>
				<b-tr>
					<b-th
						v-for="titleColumn in fields"
						:class="titleColumn.key === sortBy ? 'curSortByTh' : null"
						@click.prevent="sorting(titleColumn.key)"
					>
							<div style="position: relative;">
								<span>{{ titleColumn.label }}</span>
								<feather-icon
									v-if="titleColumn.key === sortBy"
									:icon="sortDesc ? 'ChevronUpIcon' : 'ChevronDownIcon'"
									size="12"
									@click.stop="sorting(titleColumn.key)"
									style="position: absolute; padding-top: 1px;"
								/>
							</div>
					</b-th>
				</b-tr>
			</b-thead>
			<b-tbody>
				<table-tree-node
					:data="data"
					:fields="fields"
					:actions="actions"
				/>
			</b-tbody>
			<b-tfoot v-if="footFields && footFields.length > 0">
				<b-tr>
					<b-td v-for="footColumn in footFields">{{ footColumn }}</b-td>
				</b-tr>
			</b-tfoot>
		</b-table-simple>
		<b-pagination
			v-if="showPagination"
			:total-rows="count"
			:per-page="perPage"
			:value="curPage"
			:align="'right'"
			@change="pagination"
		/>
	</div>
</template>

<script>
import TableTreeNode from "./TableTreeNode/TableTreeNode.vue";
import {
    BTableSimple,
	BThead,
	BTbody,
	BTfoot,
	BTh,
	BTd,
	BTr,
    BPagination,
	BRow,
} from "bootstrap-vue";

export default {
	name: "TableTree",
	components: {
		BTableSimple,
		BThead,
		BTbody,
		BTfoot,
		BTh,
		BTd,
		BTr,
		BPagination,
		BRow,
		TableTreeNode,
	},
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
		"changePage",
		"resetPagination",
		"sortTable",
	],
	data() {
		return {
            sortBy: 'date_created',
            sortDesc: false,
			fieldKeys: this.fields.map(item => item.key),
			sortingKeys: this.fields.filter(item => item.sortable === true),
		};
	},
	computed: {
        showPagination() {
            return Math.ceil(this.count / this.perPage) > 1;
        },
	},
	watch: {
        'sortBy'(newValue) {
            if (!newValue) return;
            this.$emit("sortTable", this.sortBy, this.sortDesc);
        },
        'sortDesc'() {
            this.$emit("sortTable", this.sortBy, this.sortDesc);
        },
	},
	mounted() {
		this.$emit("resetPagination");
		this.$emit("fetchData");
	},
	methods: {
		pagination(page) {
			this.$emit("changePage", page);
		},
		sorting(key) {
			if (this.sortingKeys.findIndex(item => item.key === key) === -1) return;
			if (this.sortBy === key) {
				this.sortDesc = !this.sortDesc;
				return;
			}
			this.sortBy = key;
			this.sortDesc = false;
		},
	},
};
</script>

<style lang="scss">
.curSortByTh {
	// color: red;
}
</style>
