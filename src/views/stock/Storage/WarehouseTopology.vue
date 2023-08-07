<template>
	<div>
		<b-card>
			<b-row>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-group>
						<b-form-input
							placeholder="Номер"
							v-model="filters.number"
						/>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-group>
						<b-form-input
							placeholder="Номер"
							v-model="filters.number"
						/>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-group>
						<b-form-input
							placeholder="Номер"
							v-model="filters.number"
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-collapse v-model="visible" id="filters-collapse">
				<b-row>
				</b-row>
			</b-collapse>
			<template #footer>
				<a class="filter-orders__btn mr-1" v-b-toggle="'filters-collapse'">
					<feather-icon
						:icon="visible ? 'ChevronUpIcon' : 'ChevronDownIcon'"
						size="12"
					/>
					<span class="filter-orders__btn-text"> Все фильтры </span>
				</a>
				<a 
					class="filter-orders__btn" 
					@click="() => {
						resetFilters(),
						resetInputs(),
						fetchPaymentOrders()
					}"
				>
					<feather-icon icon="XCircleIcon" size="12" />
					<span class="filter-orders__btn-text"> Сбросить все фильтры </span>
				</a>
			</template>
		</b-card>
		<!-- <b-row>
			<b-col class="mb-1" cols="12" md="4">
				<v-select
					label="type"
				/>
			</b-col>
		</b-row> -->
		<b-card style="margin-top: 20px;">
			<b-table
				:items="orders"
				:fields="fields"
				striped
				responsive
				@row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
			>
			</b-table>
			<b-pagination
				v-if="showPagination"
				:total-rows="count"
				:per-page="perPage"
				@change="changePage"
				:value="curPage"
				align="right"
			/>
		</b-card>
	</div>
</template>

<script>
	import { mapGetters, mapActions, mapMutations } from "vuex";
	import vSelect from 'vue-select'
	import {
		BRow,
		BCol,
		BCard,
		BTable,
		BButton,
		BFormGroup,
		BCollapse,
		VBToggle,
		BBadge,
		BFormCheckbox,
		BFormInput,
		BPagination,
		BIconXCircle,
		BImg,
		BFormTextarea,
	} from "bootstrap-vue";
	import { RoleConstants } from '@/utils/role';
	import store from "@/store/index";
	export default {
		data() {
			return {
				visible: false,
				filters: {
					number: null,
				},
				fields: [
					{ key: "storage", label: "ХРАНИЛИЩЕ" },
					{ key: "name", label: "ИМЯ" },
					{ key: "action", label: "ДЕЙСТВИЕ" },
				],
				orders: [],
			};
		},
		components: {
			BRow,
			BCol,
			BCard,
			BTable,
			BButton,
			BFormGroup,
			BCollapse,
			VBToggle,
			BBadge,
			BIconXCircle,
			BFormCheckbox,
			BFormInput,
			BImg,
			BFormTextarea,
			BPagination,
			vSelect
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
		},
		computed: {
			showPagination() {
				return Math.ceil(this.count / this.perPage) > 1;
			},
			readOnly() {
				return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
			}
		},
		methods: {
			formatDate(date) {
				return this.dayjs(date).format("DD.MM.YYYY");
			},
		},
		mounted() {
		},
	};
</script>

<style lang="scss" scoped>
	.whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }

</style>
