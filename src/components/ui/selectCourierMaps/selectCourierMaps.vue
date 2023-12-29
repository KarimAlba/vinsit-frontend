<template>
	<div style="position: relative;">
		<v-select
			label="id"
			@search="onSearch"
			@input="input"
			:options="maps"
			:placeholder="placeholder"
			:filterable="false"
			:disabled="disabled"
			:reduce="reduce => reduce.id"
			:value="map"
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
				maps: [],
				map: null,
				disabledBtn: true,
				newMapName: '',
			};
		},
		components: {
			vSelect,
			BIconPlusSquare,
		},
        watch: {
            'value'() {
                this.getMap(this.value);
                window.setTimeout(() => {
                    this.fetchMaps(
                        this.map ? this.map.name : '',
                        null,
                        this,
                        (id) => id,
                    );
                }, 0);
				this.getMap(this.value)
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
					this.fetchMaps(search, loading, this);
				};
			},
			fetchMaps: _.debounce((search, loading, vm, callback) => {
				vm.$api.couriers.getCourierMaps({
                    search,
                    limit: 100,
                }).then((response) => {
					vm.maps = response.data.results;
                    if (vm.maps.length && callback) {
                        callback(vm.maps[0].id);
                    }
					loading ? loading(false) : null;
				});
			}, 500),
            async getMap(id) {
                await this.$api.couriers.getCourierMap(id).then((response) => {
					this.map = response.data;
				});
            },
			input(map) {
                // console.log('map - ', map);
				this.$emit("input", map);
				this.disabledBtn = true;
			},
			changeSearchValue:_.debounce((mapName, vm)  => {
				vm.newMapName = mapName;
				vm.checkMap();
			}, 500),
			checkMap() {
				if (this.maps.findIndex(
                    map => map.name 
							? (
								this.newMapName 
									? map.name.toLowerCase() === this.newMapName.toLowerCase()
									: null
								) 
							: null
						) === -1) {
					this.disabledBtn = false;
				};
			},
			
		},
		mounted() {
			this.value ? this.getMap(this.value) : null;
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
