<template>
  <b-form-input
    class="vin-datepicker"
    ref="litepicker"
    :placeholder="placeholder"
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
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
  },
  components: {
    BFormInput,
    Litepicker,
	BIcon,
  },
  data() {
    return {
		picker: null,
	};
  },
  watch: {
	'startDate' (newValue, oldValue) {
		if (!newValue) {
			this.picker.clearSelection();
			this.picker.gotoDate(new Date());
		}
	},
  },
  methods: {
    initLitePicker() {
      let litepicker = this.$refs.litepicker;

      this.picker = new Litepicker({
        element: litepicker.$el,
        singleMode: false,
        allowRepick: true,
        numberOfMonths: 2,
        numberOfColumns: 2,
        showTooltip: false,
        format: "DD.MM.YYYY",
		// startDate: this.startDate,
		// endDate: this.endDate,

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
