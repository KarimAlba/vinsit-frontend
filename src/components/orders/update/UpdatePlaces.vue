<template>
  <div>
    <b-card-actions v-if="placesList" title="Информация о грузе" actionCollapse>
      <b-table
        :items="placesList"
        :fields="orderPlacesFields"
        striped
        responsive
      >
        <template #cell(barcode)="data">
            <a
                class="link"
                style="color: #3d78b4;"
                @click="handlePdfDownload($event, data.item.barcode, data.item.place_no)"
            >
                Штрих-код
            </a>
        </template>

        <template #cell(place_no)="data">
          <validation-provider v-slot="{ errors, validate }" rules="required">
            <b-form-group :invalid-feedback="errors[0]" :state="!errors.length">
              <b-form-input
                v-model="data.item.place_no"
                :disabled="readOnly"
                type="number"
                :state="errors.length > 0 ? false : null"
                @change="
                  updatePlace(data.item.id, $event, 'place_no', validate)
                "
              ></b-form-input>
            </b-form-group>
          </validation-provider>
        </template>

        <template #cell(weight)="data">
          <validation-provider v-slot="{ errors, validate }" rules="required">
            <b-form-group :invalid-feedback="errors[0]" :state="!errors.length">
              <b-form-input
                v-model="data.item.weight"
                :disabled="readOnly"
                type="number"
                :state="errors.length > 0 ? false : null"
                @change="updatePlace(data.item.id, $event, 'weight', validate)"
              ></b-form-input>
            </b-form-group>
          </validation-provider>
        </template>

        <template #cell(length)="data">
          <b-form-input
            v-model="data.item.length"
            :disabled="readOnly"
            @change="updatePlace(data.item.id, $event, 'length')"
          ></b-form-input>
        </template>

        <template #cell(width)="data">
          <b-form-input
            v-model="data.item.width"
            :disabled="readOnly"
            @change="updatePlace(data.item.id, $event, 'width')"
          ></b-form-input>
        </template>

        <template #cell(height)="data">
          <b-form-input
            v-model="data.item.height"
            :disabled="readOnly"
            @change="updatePlace(data.item.id, $event, 'height')"
          ></b-form-input>
        </template>

        <template #cell(seal_number)="data">
          <b-form-input
            v-model="data.item.seal_number"
            :disabled="readOnly"
            @change="updatePlace(data.item.id, $event, 'seal_number')"
          ></b-form-input>
        </template>

        <!-- <template #cell(description)="data">
          <b-form-input
            v-model="data.item.description"
            @change="updatePlace(data.item.id, $event, 'description')"
          ></b-form-input>
        </template> -->

        <template #cell(delete)="data">
          <b-button
            v-b-tooltip.hover
            title="Удалить место"
            variant="danger"
            size="sm"
            @click="deletePlace(data.item.id)"
            :disabled="readOnly"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </template>
      </b-table>

      <div class="d-flex align-items-center justify-content-between">
        <div>
          <p>
            Всего мест: <b>{{ placesList.length }} </b>
          </p>
        </div>

        <div>
            <b-button v-b-modal.modal-create-place variant="primary" size="sm" :disabled="readOnly">
                Добавить место
            </b-button
          >
        </div>
      </div>
    </b-card-actions>

    <b-modal id="modal-create-place" title="Добавить место" hide-footer>
      <validation-observer v-slot="{ invalid }">
        <b-row>
          <b-col cols="12" md="12">
            <validation-provider #default="{ errors }" rules="required">
              <b-form-group
                label="# места"
                :invalid-feedback="errors[0]"
                :state="!errors.length"
              >
                <b-form-input
                    v-model="newPlace.place_no"
                    :disabled="readOnly"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                ></b-form-input>
              </b-form-group>
            </validation-provider>
          </b-col>

          <b-col cols="12" md="3">
            <validation-provider #default="{ errors }" rules="required">
              <b-form-group
                label="Вес"
                :invalid-feedback="errors[0]"
                :state="!errors.length"
              >
                <b-form-input
                    v-model="newPlace.weight"
                    :disabled="readOnly"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                ></b-form-input>
              </b-form-group>
            </validation-provider>
          </b-col>

          <b-col cols="12" md="3">
            <b-form-group label="Ширина">
              <b-form-input
                type="number"
                v-model="newPlace.width"
                :disabled="readOnly"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="3">
            <b-form-group label="Длина">
              <b-form-input
                type="number"
                v-model="newPlace.length"
                :disabled="readOnly"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="3">
            <b-form-group label="Высота">
              <b-form-input
                type="number"
                v-model="newPlace.height"
                :disabled="readOnly"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <!-- <b-col cols="12" md="12">
            <b-form-group label="Примечание">
              <b-form-input v-model="newPlace.description"></b-form-input>
            </b-form-group>
          </b-col> -->
        </b-row>

        <b-row>
            <b-col cols="12" md="12">
                <validation-provider #default="{ errors }">
                <b-form-group
                    label="Пломба"
                    :invalid-feedback="errors[0]"
                    :state="!errors.length"
                >
                    <b-form-input
                        v-model="newPlace.seal_number"
                        :disabled="readOnly"
                        type="number"
                        :state="errors.length > 0 ? false : null"
                    ></b-form-input>
                </b-form-group>
                </validation-provider>
            </b-col>
        </b-row>

        <b-row class="justify-content-between">
            <b-col cols="12" md="3" class="align-self-end">
                <b-button variant="primary" :disabled="invalid || readOnly" @click="createPlace">
                    Добавить
                </b-button>
            </b-col>
            <b-col cols="12" md="3" class="align-self-end">
                <b-form-group label="Кол-во" style="margin-bottom: 0;">
                    <b-form-input type="number" v-model="newPlaceCount" :disabled="readOnly"></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
      </validation-observer>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, confirmed, password } from "@validations";
import downloadPdf from '../../../utils/downloadPdf';

import vSelect from "vue-select";

import {
  BOverlay,
  BRow,
  BCol,
  BTabs,
  BTab,
  BCard,
  BFormInput,
  BFormCheckbox,
  BCardTitle,
  BCardFooter,
  BBadge,
  BFormTextarea,
  BFormGroup,
  BTable,
  BButton,
  VBTooltip,
} from "bootstrap-vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BOverlay,
    BRow,
    BCol,
    BTabs,
    BTab,
    BCard,
    BFormInput,
    BFormCheckbox,
    BCardTitle,
    BCardFooter,
    BBadge,
    BFormTextarea,
    BFormGroup,
    BTable,
    BButton,
    BCardActions,

    vSelect,
  },
  props: {
    order: {
      type: [Number, String],
      required: true,
    },
    places: {
      type: Array,
      reuqired: true,
      default: () => [],
    },
    readOnly: false,
  },
  directives: {
    "b-tooltip": VBTooltip,
  },
  data() {
    return {
      orderPlacesFields: [
        { key: "barcode", label: "Штрих-код" },
        { key: "place_no", label: "№ места" },
        { key: "length", label: "Длина, см" },
        { key: "width", label: "Ширина, см" },
        { key: "height", label: "Высота, см" },
        { key: "weight", label: "Фактический вес, кг" },
        { key: "seal_number", label: "Пломба" },
        /* { key: "status", label: "Статус" },
        { key: "rack", label: "Rack" },
        { key: "tare", label: "tare" }, */
        { key: "description", label: "Примечание" },
        { key: "delete", label: "" },
      ],
      newPlace: {},
      newPlaceCount: 1,
    };
  },
  computed: {
    ...mapGetters({
      orderStatus: "moduleOrders/getOrderStatus",
    }),
    placesList: {
      get() {
        return this.places;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    async handlePdfDownload(event, barcode, place_no) {
        event.preventDefault();
        downloadPdf(barcode, `barcode-${this.order}-${place_no}.png`);
    },
    handlePlaceCreationResponse(response) {
        console.log(response);
        if (response.status === 201) {
            this.placesList.push(response.data);
            this.$toast({
                component: ToastificationContent,
                props: {
                title: "Успешно",
                text: "Место добавлено",
                icon: "CheckCircleIcon",
                variant: "success",
                },
            });

            this.newPlace = {};

            this.$nextTick(() => {
                this.$bvModal.hide("modal-create-place");
            });
        } else {
            this.$toast({
                component: ToastificationContent,
                props: {
                title: "Ошибка",
                text: "Не удалось создать",
                icon: "XIcon",
                variant: "danger",
                },
            });
        }
    },
    createPlace() {
        const requests = [];
        if (this.newPlaceCount > 1) {
            for (let i = 0; i < this.newPlaceCount; i++) {
                requests.push(this.$api.places.createPlace({
                    order: this.order,
                    ...this.newPlace,
                    place_no: Number(this.newPlace.place_no) + i,
                }));
            }
            Promise.allSettled(requests)
                .then((results) => {
                    results.forEach((result) => {
                        this.handlePlaceCreationResponse(result.value);
                    });
                });
            return;
        }
        this.$api.places
            .createPlace({ order: this.order, ...this.newPlace })
            .then(this.handlePlaceCreationResponse);
    },
    fetchUpdatePlace(id, val, key) {
      let payload = {};
      payload[key] = val;
      this.$api.places.updatePlace(id, payload).then((response) => {
        if (response.status === 200) {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Успешно",
              text: "Место обновлено",
              icon: "CheckCircleIcon",
              variant: "success",
            },
          });
        } else {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Ошибка",
              text: "Не удалось обновить",
              icon: "XIcon",
              variant: "danger",
            },
          });
        }
      });
    },
    async updatePlace(idPlace, newVal, key, validate) {
      if (validate) {
        const { valid } = await validate(newVal);
        if (valid) {
          this.fetchUpdatePlace(idPlace, newVal, key);
        }
      } else {
        this.fetchUpdatePlace(idPlace, newVal, key);
      }
    },
    deletePlace(id) {
      this.$api.places.deletePlace(id).then((response) => {
        if (response.status === 204) {
          const inx = this.placesList.findIndex((p) => p.id === id);
          this.placesList = this.placesList
            .slice(0, inx)
            .concat(this.placesList.slice(inx + 1));

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Успешно",
              text: "Место удалено",
              icon: "CheckCircleIcon",
              variant: "success",
            },
          });
        } else {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Ошибка",
              text: "Не удалось удалить",
              icon: "XIcon",
              variant: "danger",
            },
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
