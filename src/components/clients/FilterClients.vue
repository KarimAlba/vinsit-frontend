<template>
    <div>
        <b-card>
            <b-row>
                <b-col cols="12">
                    <b-form-group label="Поиск">
                        <b-form-input
                            debounce="500"
                            v-model="filters.search"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-collapse v-model="visible" id="filters-collapse">
                <b-row>
                    <b-col class="mb-1" cols="12" md="4">
                        <v-select
                            label="short_title"
                            :reduce="(mode) => mode.id"
                            placeholder="Тип контрагента"
                            :options="clientType"
                            v-model="filters.type"
                        />
                    </b-col>
                </b-row>
            </b-collapse>
            <template #footer>
                <a class="filter-clients__btn mr-1" v-b-toggle="'filters-collapse'">
                    <feather-icon
                        :icon="visible ? 'ChevronUpIcon' : 'ChevronDownIcon'"
                        size="12"
                    />
                    <span class="filter-clients__btn-text"> Все фильтры </span>
                </a>
                <a 
                    class="filter-clients__btn" 
                    @click="() => {
                        resetFilters(), 
                        fetchClients()
                    }"
                >
                    <feather-icon icon="XCircleIcon" size="12" />
                    <span class="filter-clients__btn-text"> Сбросить все фильтры </span>
                </a>
            </template>
        </b-card>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { BRow, BCol, BCard, BFormInput, BFormGroup, BCollapse, VBToggle } from "bootstrap-vue";
import vSelect from "vue-select";

export default {
    data() {
        return {
            visible: false,
        };
    },
    components: {
        BRow,
        BCol,
        BCard,
        BFormGroup,
        BFormInput,
        BCollapse,
        VBToggle,
        vSelect
    },
    directives: {
        "b-toggle": VBToggle,
    },
    watch: {
        filters: {
            handler(val) {
                this.resetPagination();
                this.fetchClients();
            },
            deep: true,
        },
    },
    computed: {
        ...mapGetters({
            filters: "moduleClients/getFilters",
            clientType: "moduleClients/getClientType",
        }),
    },
    methods: {
        ...mapActions({
            fetchClients: "moduleClients/fetchClients",
            resetPagination: "moduleClients/resetPagination",
            resetFilters: "moduleClients/resetFilters",
        }),
    },
};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";

	.filter-clients {
		&__btn {
			display: inline-flex;
			align-items: center;

			&:hover {
				.filter-clients__btn-text {
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
