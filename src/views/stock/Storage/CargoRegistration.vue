<template>
	<div>
		<b-card class="px-1">
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
			<b-form-input 
				class="mt-24"
				style="margin-top: 24px;"
				placeholder="Номер заказа"
				@input="setSeacrhParams"
			/>
			<!-- <b-form-textarea
				class="t-24 w-full ph-5"
				style="margin-top: 24px;"
				v-model="text"
				placeholder=""
			/> -->
		</b-card>

		<FiltrationCargoRegistration/>

		<div style="display: flex; justify-content: space-between;">
			<div>
				<h3>Найдено: {{ count }} </h3>				
			</div>
			<div style="display: flex;">
				<!-- <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
					<b-button 
						variant="white"
						v-if="!readOnly" 
						:disabled="readOnly"
						class="whiteBtn"
					>
						Отображать маршрут
					</b-button>
				</div>
				<div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
					<b-button 
						variant="white"
						v-if="!readOnly" 
						:disabled="readOnly"
						class="whiteBtn"
					>
						Раскладка/Сборка
					</b-button>
				</div> -->
				<div class="d-flex align-items-center justify-content-right">
					<b-button 
						variant="primary" 
						v-if="!readOnly" 
						:disabled="readOnly"
					>
						Зарегистрировать груз
					</b-button>
				</div>
			</div>
		</div>
		<b-card style="margin-top: 20px;">
			<b-table
				:items="storedOrders"
				:fields="fields"
				striped
				responsive
				@row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
			>
				<template #cell(id)="data">
					<router-link style="border-bottom: 1px dotted blue">
						{{ data.item.id }}
					</router-link>
				</template>

				<template #cell(number_GM)="data">
					{{ data.item.number_GM ? data.item.number_GM : '-'}}
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
	import FiltrationCargoRegistration from '@/components/addressBasedStorage/FiltrationCargoRegistration'
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
					{ key: "id", label: "НОМЕР ЗАКАЗА" },
					{ key: "number_GM", label: "НОМЕР ГМ" },
					{ key: "shelf", label: "ПОЛКА" },
					{ key: "Shelving_zone", label: "СТЕЛАЖ ЗОНА" },
					{ key: "Time_registration", label: "ВРЕМЯ РЕГИСТРАЦИИ" },
					{ key: "user", label: "ПОЛЬЗОВАТЕЛЬ" },
					{ key: "status", label: "СТАТУС" },
					{ key: "office", label: "ОФИС" },
				],
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
			FiltrationCargoRegistration
		},
		watch: {},
		computed: {
			...mapGetters({
				loading: "moduleCargoRegistration/getLoading",
				count: "moduleCargoRegistration/getCount",
				perPage: "moduleCargoRegistration/getCountPerPage",
				curPage: "moduleCargoRegistration/getCurPage",
				storedOrders: "moduleCargoRegistration/getStoredOrders",
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
			}),
			formatDate(date) {
				return this.dayjs(date).format("DD.MM.YYYY");
			},
			setSeacrhParams(event) {
				console.log(event.target.value);
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
