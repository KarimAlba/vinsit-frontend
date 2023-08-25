<template>
	<div>
		<b-card>
			<div style="display: flex;">
				<div 
					class="d-flex align-items-center justify-content-right" 
					style="margin-right: 18px;"
				>
					<b-button 
						variant="primary" 
						v-if="!readOnly" 
						:disabled="readOnly"
					>
						Уточнить поиск
					</b-button>
				</div>
				<div 
					class="d-flex align-items-center justify-content-right" 
					style="margin-right: 18px;"
				>
					<b-button 
						variant="white"
						v-if="!readOnly" 
						:disabled="readOnly"
						class="whiteBtn"
					>
						Отображать маршрут
					</b-button>
				</div>
				<div 
					class="d-flex align-items-center justify-content-right" 
					style="margin-right: 18px;"
				>
					<b-button 
						variant="white"
						v-if="!readOnly" 
						:disabled="readOnly"
						class="whiteBtn"
					>
						Раскладка/Сборка
					</b-button>
				</div>
			</div>
			<FilterCargoRegistration/>
		</b-card>

		<div style="display: flex; justify-content: space-between;">
			<div>
				<h3>Найдено: {{ count }} </h3>				
			</div>
			<div class="d-flex align-items-center justify-content-right">
				<b-button 
					variant="primary" 
					v-if="!readOnly" 
					:disabled="readOnly"
					:to="{ name: 'stored-order' }"
				>
					Зарегистрировать груз
				</b-button>
			</div>
		</div>
		<b-card style="margin-top: 20px;">
			<b-table
				:items="storedOrders"
				:fields="fields"
				striped
				responsive

				:sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :no-local-sorting="true"
			>

				<template #cell(id)="data">
					<router-link 
						:to="{ name: 'stored-order', params: { id: data.item.id } }"
						style="border-bottom: 1px dotted blue"
					>
						{{ data.item.id }}
					</router-link>
				</template>

				<template #cell(number_GM)="data">
					{{ data.item.number_GM ? data.item.number_GM : '-'}}
				</template>

                <template #cell(date_created)="data">
                    {{ formatDate(data.item.date_created) }}
                </template>

				<template #cell(status)="data">
                    <b-badge :variant="getColorStatus(data.item.status)">
                        {{ data.item.status || "Не задан" }}
                    </b-badge>
                </template>

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
	import FilterCargoRegistration from '@/components/addressBasedStorage/FilterCargoRegistration'
	import { mapGetters, mapActions, mapMutations } from "vuex";
	import {
		BRow,
		BCol,
		BCard,
		BTable,
		BButton,
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
				fields: [
					{ key: "id", label: "НОМЕР ЗАКАЗА", sortable: true },
					{ key: "number_GM", label: "НОМЕР ГМ", sortable: false },
					{ key: "shelf", label: "ПОЛКА", sortable: false },
					{ key: "zone", label: "СТЕЛАЖ ЗОНА", sortable: false },
					{ key: "date_created", label: "ДАТА РЕГИСТРАЦИИ", sortable: true },
					{ key: "user_created", label: "ПОЛЬЗОВАТЕЛЬ", sortable: false },
					{ key: "status", label: "СТАТУС", sortable: false },
					{ key: "office", label: "ОФИС", sortable: false },
				],
				orderStatus: [],
				sortBy: 'date_created',
            	sortDesc: false,
			};
		},
		components: {
			BRow,
			BCol,
			BCard,
			BTable,
			BButton,
			BBadge,
			BIconXCircle,
			BFormCheckbox,
			BFormInput,
			BImg,
			BFormTextarea,
			BPagination,
			FilterCargoRegistration
		},
		watch: {
			'sortBy'(newValue) {
				if (!newValue) return;
				this.sortTable();
			},
			'sortDesc'(newValue) {
				this.sortTable();
			}
		},
		computed: {
			...mapGetters({
				loading: "moduleCargoRegistration/getLoading",
				count: "moduleCargoRegistration/getCount",
				perPage: "moduleCargoRegistration/getCountPerPage",
				curPage: "moduleCargoRegistration/getCurPage",
				storedOrders: "moduleCargoRegistration/getStoredOrders",
				ordering: "moduleCargoRegistration/getOrdering",
				clientType: "moduleClients/getClientType",
				editableStoredOrder: "moduleCargoRegistration/getEditableStoredOrder"
			}),
			showPagination() {
				return Math.ceil(this.count / this.perPage) > 1;
			},
			readOnly() {
				return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
			}
		},
		methods: {
			...mapActions({
				fetchStoredOrders: "moduleCargoRegistration/fetchStoredOrders",
				resetPagination: "moduleCargoRegistration/resetPagination",
			}),
			...mapMutations({
				changeCurPage: "moduleCargoRegistration/changePage",
				changeOrdering: "moduleCargoRegistration/changeOrdering",
			}),
			formatDate(date) {
				return this.dayjs(date).format("DD.MM.YYYY");
			},
			changePage(page) {
				this.changeCurPage(page);
				this.fetchStoredOrders();
			},
			checkSortName() {
				switch(this.sortBy) {
					case 'id':
						return 'id';
					default:
						return this.sortBy;
				};
			},
			sortTable() {
				let ordering = this.checkSortName();
				if (this.sortDesc) {
					this.changeOrdering(ordering);
				} else {
					this.changeOrdering(`-${ordering}`);
				};

				this.resetPagination();
				setTimeout(() => {
					this.fetchStoredOrders();
				}, 0);
			},
			getColorStatus(status) {
				return (
					this.orderStatus.find((x) => x.title === status)?.color || "secondary"
				);
			}
		},
		mounted() {
        	this.fetchStoredOrders();
			this.resetPagination();
		},
	};
</script>

<style lang="scss" scoped>
	.whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }

</style>
