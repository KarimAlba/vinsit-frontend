<template>
    <div class="couriers">
        <b-card>
            <b-row>
                <b-col class="mb-1" cols="12" md="4">
                    <b-form-group label="Город">
                        <select-cities
                            v-model="filters.city"
                            :placeholder="'Город'"
                        />
                    </b-form-group>
                </b-col>
                <b-col  cols="12" md="4">
                    <b-form-group label="ФИО">
                        <select-users
                            v-model="filters.courier"
                            placeholder="ФИО"
                        />
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group  label="Офис">
                        <select-offices
                            :placeholder="'Офис'"
                            v-model="filters.stock"
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

        <b-button
            variant="primary"
			v-b-modal.modal-create-courier 
            class="mb-2"
        >
            Добавить курьера
        </b-button>

        <b-card>
            <b-table
                :items="couriers"
                :fields="fields"
                striped
                responsive
                @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
            >
                <template #cell(full_name)="data">
                    <span
			            v-b-modal.modal-create-courier 
                        @click="handleEditCourier(data.item.id)"
                        style="color: blue; text-decoration: underline; cursor: pointer;"
                    >
                        {{ data.item.full_name }}
                    </span>
                </template>

                <template #cell(phone_number)="data">
                    {{ data.item.phone_number }}
                </template>

                <template #cell(transport)="data">
                    {{ data.item.transport }}
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
        <b-modal
            id="modal-create-courier"
            ref="modal"
            title="Новый курьер"
            @ok="handleSaveCourier"
            @close="clearNewCourier"
            @cancel="clearNewCourier"
        >
            <b-col cols="12">
                <b-form-group label="ФИО">
                    <b-form-input 
                        placeholder="ФИО"
                        v-model="newCourier.full_name"
                    />
                </b-form-group>
            </b-col>
            <b-col cols="12">
                <b-form-group label="Город">
                    <select-cities
                        v-model="newCourier.city"
                        :placeholder="'Город'"
                    />
                </b-form-group>
            </b-col>
            <b-col cols="12">
                <b-form-group  label="Номер телефона">
                    <b-form-input 
                        placeholder="Номер телефона"
                        v-model="newCourier.phone_number"
                    />
                </b-form-group>
            </b-col>
            <b-col cols="12">
                <b-form-group  label="Офис">
                    <select-offices
                        :placeholder="'Офис'"
                        v-model="filters.office"
                    />
                </b-form-group>
            </b-col>
            <b-col cols="12">
                <b-form-group  label="Транспорт">
                    <b-form-input 
                        placeholder="Транспорт"
                        v-model="newCourier.transport"
                    />
                </b-form-group>
            </b-col>
        </b-modal>
    </div>
</template>

<script>
	import { mapGetters, mapActions } from "vuex";

	import {
		BRow,
		BCol,
		BCard,
		BFormGroup,
		BFormInput,
        BTable,
		BCollapse,
		VBToggle,
		BButton
	} from "bootstrap-vue";
	import vSelect from "vue-select";
	import { debounce } from "lodash";
	import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";
	import SelectOffices from "@/components/ui/selectOffices/selectOffices.vue";
	import SelectUsers from "@/components/ui/selectUsers/selectUsers.vue";
	import SelectCities from "@/components/ui/selectCities/selectCities.vue";
    import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

	export default {
		data() {
			return {
                curPage: 1,
                perPage: 1,
                count: 1,
                filters: {
                    city: null,
                    courier: null,
                    office: null,
                },
                fields: [
                    { key: "full_name", label: "ФИО" },
                    { key: "phone_number", label: "Телефон" },
                    { key: "transport", label: "Транспорт" },
                ],
                couriers: [],
                isEditCourier: false,
                newCourier: {
                    full_name: null,
                    city: null,
                    phone_number: null,
                    transport: null,
                    office: null,
                    role: "CR",
                    password: "Надежный пароль"
                }
			};
		},
		components: {
			BRow,
			BCol,
			BCard,
			BFormGroup,
			BFormInput,
            BTable,
			BCollapse,
            BButton,
			VBToggle,

			vSelect,
			SelectOffices,
			SelectUsers,
			SelectCities,
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
			filters: {
				handler(val) {
                    console.log("val", val)
					this.resetPagination();
					this.fetchCouriers();
				},
				deep: true,
			},
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
			handleSearchField: _.debounce((value, vm) => {
				vm.filters.search = value;
			}, 500),
            changePage(page) {
                this.curPage = page;
                this.fetchDocuments();
            },
            resetFilters() {
                this.filters = {
                    city: null,
                    courier: null,
                    office: null,
                }
            },
            resetPagination() {
                this.curPage = 1;
            },
            fetchCouriers() {
                this.$api.user.getUsers({
                    ...this.filters, id: this.filters.courier,
                    role: "CR",
                    offset: ((this.curPage - 1) * 20),
                    limit: 20
                }).then((response) => {
                    this.couriers = response.data.results;
                })
            },
            handleEditCourier(id) {
                this.isEditCourier = true;
                this.$api.user.getUser(id).then(response => {
                    this.newCourier = response.data;
                })
            },
            handleSaveCourier() {
                if (this.isEditCourier) {
                    this.editCourier();
                } else {
                    this.createCourier();
                }
            },
            clearNewCourier() {
                this.newCourier =  {
                    full_name: null,
                    city: null,
                    phone_number: null,
                    transport: null,
                    office: null,
                    role: "CR",
                    password: "Надежный пароль"
                }
            },
            createCourier() {
                this.$api.user.createUser(this.newCourier).then(resp => {
                    console.log("tyt", resp)
                    if (resp.status <= 203) {
                        console.log("uiui")
                        this.fetchCouriers();
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: "Успешно",
                                text: "Курьер создан",
                                icon: "CheckCircleIcon",
                                variant: "success",
                            },
                        });
                    } else {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Ошибка",
                            text: "Не удалось создать курьера.",
                            icon: "XIcon",
                            variant: "danger",
                        },
                    });
                    }
                });
                this.clearNewCourier();
            },
            editCourier() {
                this.$api.user.editUser(this.newCourier.id, this.newCourier).then(resp => {
                    console.log("tyt", resp)
                    if (resp.status <= 203) {
                        console.log("uiui")
                        this.fetchCouriers();
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: "Успешно",
                                text: "Данные изменен",
                                icon: "CheckCircleIcon",
                                variant: "success",
                            },
                        });
                    } else {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Ошибка",
                            text: "Не удалось изменить данные.",
                            icon: "XIcon",
                            variant: "danger",
                        },
                    });
                    }
                })
                this.isEditCourier = false;
                this.clearNewCourier();
            }
		},
		mounted() {
            this.fetchCouriers();
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

