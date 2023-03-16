<template>
  <b-form-input
    class="vin-datepicker"
    ref="litepicker"
    :placeholder="placeholder"
    readonly
  ></b-form-input>
</template>

<script>
import { BFormInput, BIcon } from "bootstrap-vue";
import Litepicker from "litepicker";

export default {
  name: "AppDatepicker",
  props: {
    placeholder: {
      type: String,
    },
  },
  components: {
    BFormInput,
    Litepicker,
	BIcon,
  },
  data() {
    return {};
  },
  methods: {
    initLitePicker() {
      let litepicker = this.$refs.litepicker;

      new Litepicker({
        element: litepicker.$el,
        singleMode: false,
        allowRepick: true,
        numberOfMonths: 2,
        numberOfColumns: 2,
        showTooltip: false,
        format: "DD.MM.YYYY",

        lang: "ru-RU",
        setup: (picker) => {
          picker.on("selected", (date1, date2) => {
            this.selectedDates(date1, date2);
          });
        },
      });
    },
    selectedDates(start, end) {
      this.$emit("selectedDates", {
        start: start.dateInstance,
        end: end.dateInstance,
      });
    },
  },
  mounted() {
    this.initLitePicker();
  },
  unmounted() {
	this.$refs.litepicker.clearSelection();
  },
};
</script>

<style lang="scss">
.vin-datepicker {
  cursor: pointer;

  &.form-control[readonly] {
    background-color: #fff;
  }
}
</style>
