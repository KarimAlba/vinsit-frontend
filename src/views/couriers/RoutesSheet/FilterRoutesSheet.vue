<template>
	<b-card>
        <b-row>
            <b-col class="mb-1" md="4">
                <b-form-group lable="Дата">
                    <b-form-datepicker
                        label="date"
                        v-model="filters.date"
                        placeholder="Дата"
                    />
                </b-form-group>
            </b-col>
            <b-col class="mb-1" md="4">
                <select-cities
                    v-model="filters.city"
                    :placeholder="'Город'"
                />
            </b-col>
            <b-col cols="12" md="4">
                <b-form-group lable="Офис">
                    <select-offices
                        :placeholder="'Офис'"
                        v-model="filters.office"
                    />
                </b-form-group>
            </b-col>
			<b-col cols="12" md="4">
                <b-form-group lable="Курьерская карта">
                    <select-map
                        :placeholder="'Курьерская карта'"
                        v-model="filters.courierMap"
						@input="handleSelectMap"
                    />
                </b-form-group>
            </b-col>
        </b-row>
		<template #footer>
			<a 
				class="filter-orders__btn" 
				@click="() => {
					resetFilters(), 
					fetchDocuments()
				}"
			>
				<feather-icon icon="XCircleIcon" size="12" />
				<span class="filter-orders__btn-text"> Сбросить все фильтры </span>
			</a>
		</template>
	</b-card>
</template>

<script>
	import { mapGetters, mapActions } from "vuex";

	import {
		BRow,
		BCol,
		BCard,
		BFormGroup,
		BFormInput,
		BFormCheckbox,
		BCollapse,
        BButton,
		VBToggle,
		BFormDatepicker
	} from "bootstrap-vue";
	import vSelect from "vue-select";
	import { debounce } from "lodash";
	import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";
	import SelectOffices from "@/components/ui/selectOffices/selectOffices.vue";
	import SelectCities from "@/components/ui/selectCities/selectCities.vue";
	import SelectMap from "@/components/ui/selectCourierMaps/selectCourierMaps.vue";

	export default {
		data() {
			return {
			};
		},
		components: {
			BRow,
			BCol,
			BCard,
			BFormGroup,
			BFormInput,
			BFormCheckbox,
			BCollapse,
            BButton,
			VBToggle,

			AppDatepicker,
			BFormDatepicker,
			vSelect,
			SelectOffices,
            SelectCities,
			SelectMap,
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
			filters: {
				handler(val) {
					this.resetPagination();
					// this.fetchMapOrders();
				},
				deep: true,
			},
			idMap(newVal) {
				this.fetchCourierMap(newVal)
			},
		},
		computed: {
			...mapGetters({
				filters: "moduleRoutesSheet/getFilters",
			}),
			idMap() {
				return this.$route.params.idMap || null;
			}
		},
		methods: {
			...mapActions({
            	fetchCourierMap: "moduleRoutesSheet/fetchMap",
				resetPagination: "moduleRoutesSheet/resetPagination",
				resetFilters: "moduleRoutesSheet/resetFilters",
			}),
			handleSearchField: _.debounce((value, vm) => {
				vm.filters.search = value;
			}, 500),
			handleSelectMap(idMap) {
				this.$router.push({ name: 'couriers-routes', params: { idMap: idMap }})
			}
		},
		mounted() {
			// if (this.$route.params.idMap) {
			// 	this.filters.courierMap = this.$route.params.idMap;
			// }
			this.resetFilters();
			this.resetPagination();
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";

	.filter-orders {
		&__btn {
			display: inline-flex;
			align-items: center;

			&:hover {
				.filter-orders__btn-text {
					color: $primary;
					border-color: $primary;
				}
			}
		}

		&__btn-text {
			margin-left: 5px;
			border-bottom: 1px dashed #000;
		}
	}
</style>
