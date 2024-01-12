<template>
	<b-card>
        <b-row>
            <b-col class="mb-1" md="4">
                <b-form-group lable="Дата">
                    <b-form-datepicker
                        label="date"
                        v-model="filters.date_created_after"
                        placeholder="Дата"
                    />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="4">
                <b-form-group lable="Номер карты">
                    <b-form-input 
                        placeholder="Номер карты"
                        v-model="filters.search"
                    />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="4">
                <b-form-group lable="Офис">
                    <select-offices
                        :placeholder="'Офис'"
                        v-model="filters.office"
                    />
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col  cols="12" md="4">
                <b-form-group lable="Курьер">
                    <select-users
                        v-model="filters.courier"
                        placeholder="Курьер"
                        role="CR"
                    />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="4">
                <b-form-group>
                    <select-courier-group
                        placeholder="Группа курьеров"
                        v-model="filters.group"
                    />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="4">
                <b-form-group>
                    <select-courier-macrozone
                        placeholder="Макрозона"
                        v-model="filters.macrozone"
                    />
                </b-form-group>
            </b-col>
        </b-row>
		<template #footer>
			<a 
				class="filter-orders__btn" 
				@click="() => {
					resetFilters()
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
    import SelectUsers from "@/components/ui/selectUsers/selectUsers.vue";
	import SelectCities from "@/components/ui/selectCities/selectCities.vue";
    import selectCourierGroup from "@/components/ui/selectCourierGroup/selectCourierGroup.vue";
	import selectCourierMacrozone from "@/components/ui/selectCourierMacrozone/selectCourierMacrozone.vue";

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
            SelectUsers,
			SelectOffices,
            SelectCities,
            selectCourierGroup,
			selectCourierMacrozone,
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
			filters: {
				handler(val) {
					this.resetPagination();
					this.fetchCourierMaps();
				},
				deep: true,
			},
		},
		computed: {
			...mapGetters({
				filters: "moduleCouriers/getFilters",
			}),
		},
		methods: {
			...mapActions({
				fetchCourierMaps: "moduleCouriers/fetchMaps",
				resetPagination: "moduleCouriers/resetPagination",
				resetFilters: "moduleCouriers/resetFilters",
			}),
			handleSearchField: _.debounce((value, vm) => {
				vm.filters.search = value;
			}, 500),
		},
		mounted() {
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

