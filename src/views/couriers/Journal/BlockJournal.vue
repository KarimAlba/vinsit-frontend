<template>
    <div class="block-documents">
        
        <b-button
            variant="primary"
			v-b-modal.modal-create-map 
            class="mb-2"
        >
            Добавить курьерскую карту
        </b-button>

        <b-card>
            <b-table
                :items="maps"
                :fields="fields"
                striped
                responsive
                @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
            >
                <template #cell(id)="data">
                    <router-link
                        style="border-bottom: 1px dotted blue"
                        :to="{ name: 'couriers-routes', params: { idMap: data.item.id } }"
                    >
                        {{ data.item.id }}
                    </router-link
                    >
                </template>

                <template #cell(date_created)="data">
                    {{ data.item.date_created ? formatDate(data.item.date_created) : '-'}}
                </template>

                <template #cell(doc_close_datetime)="data">
                    {{ data.item.doc_close_datetime ? formatDate(data.item.doc_close_datetime) : '-' }}
                </template>

                <template #cell(macrozone)="data">
                    {{ data.item.macrozone ? data.item.macrozone.name : '-' }}
                </template>

                <template #cell(courier)="data">
                    {{ data.item.courier ? data.item.courier.full_name : '-' }}
                </template>

                <template #cell(phone_number)="data">
                    {{ data.item.phone_number ? data.item.phone_number : '-' }}
                </template>

                <template #cell(group)="data">
                    {{ data.item.group ? data.item.group.name : '-' }}
                </template>

                <template #cell(action)="data">
                    <div class="blockIcon">
                        <feather-icon
                            icon="EditIcon" 
                            @click="handleEditMap(data.item.id)"
                            v-b-modal.modal-create-map 
                        />
                        <b-icon
                            icon="trash"
                            @click="handleDeleteMap(data.item.id)"
                            v-b-modal.modal-delete-map 
                        />
                    </div>
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
            id="modal-create-map"
            ref="modal"
            title="Новая карта"
            @ok="handleSaveMap"
            @close="clearNewMap"
            @cancel="clearNewMap"
        >
            <b-col cols="12">
                <span>Дата</span>
                <b-form-datepicker
                    label="date"
                    v-model="newMap.date_created"
                    placeholder="Дата"
                />
            </b-col>
            <b-col cols="12 mt-1">
                <span>Город</span>
                <select-cities
                    v-model="newMap.city"
                    :placeholder="'Город'"
                />
            </b-col>
            <b-col cols="12 mt-1">
                <span>Офис</span>
                <select-offices
                    placeholder="Офис"
                    v-model="newMap.office"
                />
            </b-col>
            <b-col  cols="12 mt-1">
                <span>Курьер</span>
                <select-users
                    v-model="newMap.courier"
                    placeholder="Курьер"
                    role="CR"
                />
            </b-col>
            <b-col cols="12 mt-1">
                <span name="macrozone">Макрозона</span>
                <select-courier-macrozone
                    placeholder="Макрозона"
                    v-model="newMap.macrozone"
                />
            </b-col>
            <b-col cols="12 mt-1">
                <span name="group">Группа курьеров</span>
                <select-courier-group
                    placeholder="Группа курьеров"
                    v-model="newMap.group"
                />
            </b-col>
        </b-modal>
        <b-modal
            id="modal-delete-map"
            ref="modal"
            title="Удаление"
            @ok="deleteMap"
            @close="clearDeleteMap"
            @cancel="clearDeleteMap"
        >
            <b-col cols="12">
                <span>Удалить курьерскую карту {{ this.deletedMapId }} ?</span>
            </b-col>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import {
    BRow,
    BCol,
    BCard,
    BTable,
    BButton,
    BBadge,
    BIcon,
    BIconTrash,
	BFormInput,
	BFormGroup,
    BFormCheckbox,
    BPagination,
	BFormDatepicker
} from "bootstrap-vue";

import { RoleConstants } from '@/utils/role';
import store from "@/store/index";
import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import SelectOffices from "@/components/ui/selectOffices/selectOffices.vue";
import SelectUsers from "@/components/ui/selectUsers/selectUsers.vue";
import SelectCities from "@/components/ui/selectCities/selectCities.vue";
import selectCourierGroup from "@/components/ui/selectCourierGroup/selectCourierGroup.vue";
import selectCourierMacrozone from "@/components/ui/selectCourierMacrozone/selectCourierMacrozone.vue";

export default {
    data() {
        return {
            fields: [
                { key: "id", label: "Номер карты" },
                { key: "date_created", label: "Дата" },
                { key: "doc_close_datetime", label: "Дата закрытия" },
                { key: "macrozone", label: "Макрозона" },
                { key: "courier", label: "Курьер" },
                { key: "phone_number", label: "Телефон" },
                { key: "group", label: "Группа курьеров" },
                { key: "action", label: "Действия" },
            ],
            newMap: {
                date_created: "",
                city: null,
                courier: null,
                office: null,
                macrozone: null,
                group: null,
            },
            isEditMap: false,
            deletedMapId: null,
        };
    },
    components: {
        BRow,
        BCol,
        BCard,
        BTable,
        BButton,
        BBadge,
        BIcon,
        BIconTrash,
		BFormInput,
		BFormGroup,
        BFormCheckbox,
        BPagination,
		BFormDatepicker,

        SelectUsers,
        SelectOffices,
        SelectCities,
        selectCourierGroup,
        selectCourierMacrozone,
        AppDatepicker,
    },
    computed: {
        ...mapGetters({
            loading: "moduleCouriers/getLoading",
            count: "moduleCouriers/getCount",
            perPage: "moduleCouriers/getCountPerPage",
            curPage: "moduleCouriers/getCurPage",
            maps: "moduleCouriers/getMaps",
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
            fetchCourierMaps: "moduleCouriers/fetchMaps",
            resetPagination: "moduleCouriers/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleCouriers/changePage",
        }),
        formatDate(date) {
            return this.dayjs(date).format("DD.MM.YYYY");
        },
        changePage(page) {
            this.changeCurPage(page);
            this.fetchDocuments();
        },
        handleEditMap(id) {
            this.isEditMap = true;
            const editMap = this.maps.find((it) => it.id == id);
            this.newMap = {
                ...editMap,
                city: editMap.city?.id,
                courier: editMap.courier?.id,
                macrozone: editMap.macrozone?.id,
                group: editMap.group?.id,
            };
        },
        handleSaveMap() {
            if (this.isEditMap) {
                this.editMap();
            } else {
                this.createMap();
            }
        },
        clearNewMap() {
            setTimeout(() => {
                    this.newMap = {
                    date_created: "",
                    city: null,
                    courier: '',
                    office: null,
                    macrozone: null,
                    group: null,
                }
            }, 1000)
        },
        createMap() {
            this.$api.couriers.createCourierMap(this.newMap).then(resp => {
                if (resp.status <= 203) {
                    this.fetchCourierMaps();
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
            })
        },
        editMap() {
            this.$api.couriers.editCourierMap(this.newMap.id, this.newMap).then(resp => {
                if (resp.status <= 203) {
                    this.fetchCourierMaps();
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Успешно",
                            text: "Данныу изменены",
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
            this.isEditMap = false;
        },
        handleDeleteMap(id) {
            this.deletedMapId = id;
        },
        deleteMap() {
            this.$api.couriers.deleteCourierMap(this.deletedMapId).then(response => {
                if (response.status <= 203) {
                    this.fetchCourierMaps();
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "",
                            text: "Курьерская карта удалена",
                            icon: "TrashIcon",
                            variant: "success",
                        },
                    });
                } else {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Ошибка",
                            text: "Не удалось удалить карту",
                            icon: "XIcon",
                            variant: "danger",
                        },
                    });
                }
            })
        },
        clearDeleteMap() {
            this.deletedMapId = null;
        },
    },
    mounted() {
        this.resetPagination();
        this.fetchCourierMaps();
    },
};
</script>

<style lang="scss" scoped>
    .whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }

    .blockIcon {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: space-around;

        svg {
            cursor: pointer;
        }
    }
</style>
