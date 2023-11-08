<template>
	<div style="position: relative;">
		<v-select
			label="name"
			@search="onSearch"
			@input="input"
			:options="zones"
			:placeholder="placeholder"
			:filterable="false"
			:disabled="disabled"
			:reduce="reduce => reduce.id"
			:value="zone"
			:clearSearchOnBlur="() => clearSearchOnBlur"
			:clearable="clearable"
		>
			<template #no-options="{ search }">
				{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
			</template>
		</v-select>
	</div>
</template>

<script>
	import vSelect from "vue-select";
	import _ from "lodash";
	import { BIconPlusSquare } from 'bootstrap-vue'

	export default {
		props: {
			placeholder: {
				type: String,
			},
			productType: {
				type: String,
				default: 'Фулфилмент',
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			reduce: {
				type: Function,
			},
			value: {
				type: [Number, String, Object],
			},
			disabledAddBtn: {
				type: Boolean,
				default: false,
			},
			clearSearchOnBlur: {
				type: Boolean,
				default: false,
			},
			clearable: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				zones: [],
				zone: null,
				disabledBtn: true,
				newZoneName: '',
			};
		},
		components: {
			vSelect,
			BIconPlusSquare,
		},
        watch: {
            'value'() {
                this.getZone(this.value);
                window.setTimeout(() => {
                    this.fetchZones(
                        this.zone ? this.zone.name : '',
                        null,
                        this,
                        (id) => id,
                    );
                }, 0);
				this.getZone(this.value)
            },
        },
		computed: {
		},
		methods: {
			onSearch(search, loading) {
				this.disabledBtn = true;
				if (search.length) {
					// this.disabledBtn = true;
					loading(true);
					this.changeSearchValue(search, this);
					this.fetchZones(search, loading, this);
				};
			},
			fetchZones: _.debounce((search, loading, vm, callback) => {
				vm.$api.couriers.getCourierMacrozones({
                    search,
                    limit: 100,
                }).then((response) => {
					vm.zones = response.data.results;
                    if (vm.zones.length && callback) {
                        callback(vm.zones[0].id);
                    }
					loading ? loading(false) : null;
				});
			}, 500),
            async getZone(id) {
                await this.$api.couriers.getCourierMacrozone(id).then((response) => {
					this.zone = response.data;
				});
            },
			input(zone) {
                // console.log('zone - ', zone);
				this.$emit("input", zone);
				this.disabledBtn = true;
			},
			changeSearchValue:_.debounce((zoneName, vm)  => {
				vm.newZoneName = zoneName;
				vm.checkZone();
			}, 500),
			checkZone() {
				if (this.zones.findIndex(
                    zone => zone.name 
							? (
								this.newZoneName 
									? zone.name.toLowerCase() === this.newZoneName.toLowerCase()
									: null
								) 
							: null
						) === -1) {
					this.disabledBtn = false;
				};
			},
			
		},
		mounted() {
			this.value ? this.getZone(this.value) : this.fetchZones("", null, this);
		}
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
	.addIcon{
		position: absolute; 
		top: 10px; 
		right: 40px;
		z-index: 5;
	}
</style>
