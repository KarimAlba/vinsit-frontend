<template>
	<div style="display: contents">
		<div v-for="(tr, indextr) in data" :key="indextr" style="display: contents">
			<b-tr class="customTr">
				<b-td v-for="(field, index) in fields" :key="index">
					<feather-icon
						v-if="field.key === 'show_details' && tr.children && tr.children.length"
                        :icon="checkOpenChildrenRow(tr.value) ? 'ChevronUpIcon' : 'ChevronDownIcon'"
						size="12"
						@click.stop="openChildrenRow(tr.value)"
					/>
					<router-link
						style="border-bottom: 1px dotted blue"
                        :to="{ name: field.componentProps.routerName, params: { id: tr[field.key] } }"
						v-else-if="field.component && field.component === 'router-link'"
					>
						{{ tr[field.key] }}
					</router-link>
					<b-row v-else-if="field.key === 'actions'" class="d-flex justify-content-around">
						<b-col>
							<b-button
								v-if="actions.delete === true"
								v-b-tooltip.hover
								title="Удалить"
								variant="danger"
								size="sm"
								@click.prevent="$emit('deleteItem', tr[field.key])"
							>
								<feather-icon icon="Trash2Icon" size="12" />
							</b-button>
						</b-col>
						<b-col>
							<component
								:is="field.component"
								v-if="field.component"
								v-bind="{...field.componentProps, value: tr[field.key]}"
							/>
						</b-col>
					</b-row>
					<template v-else>
						<span :style="field.style" @click.prevent="field.event(tr)">{{ tr[field.key] }}</span>
					</template>
				</b-td>
			</b-tr>
			<table-tree-node
				v-if="tr.children && tr.children.length && checkOpenChildrenRow(tr.value)"
				:data="data"
				:fields="fields"
				:actions="actions"
				:nesting-level="nestingLevel + 1"
			/>
		</div>
	</div>
</template>

<script>
import {
	BTd,
	BTr,
	BRow,
	BCol,
	BButton,
	VBTooltip,
	BFormInput,
} from "bootstrap-vue";

export default {
	name: "TableTreeNode",
	components: {
		BTd,
		BTr,
		BRow,
		BCol,
		BButton,
		VBTooltip,
		BFormInput,
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
		actions: {
			type: Object,
			default: () => {},
		},
		nestingLevel: {
			type: Number,
			default: () => 1,
		},
	},
	emits: ["rowClick", "fieldClick", "editItem", "deleteItem"],
	directives: {
        "b-tooltip": VBTooltip,
    },
	data() {
		return {
			openedChildrenRow: [],
		};
	},
	computed: {},
	watch: {},
	mounted() {},
	methods: {
		openChildrenRow(parentId) {
			if (this.checkOpenChildrenRow(parentId)) {
				const index = this.openedChildrenRow.findIndex((item) => item === parentId);
				this.openedChildrenRow.splice(index, 1);
				return;
			}
			this.openedChildrenRow.push(parentId);
		},
		checkOpenChildrenRow(parentId) {
			const index = this.openedChildrenRow.findIndex((item) => item === parentId);
			return index !== -1 ? true : false;
		},
	},
};
</script>

<style lang="scss">
.customTr {
	// border: 1px solid #000000;
	// border-bottom: 0px solid #000000;
	// border-right: 0px solid #000000;
}
.openTdField {
	// width: 70px;
	// box-sizing: border-box;
}
</style>
