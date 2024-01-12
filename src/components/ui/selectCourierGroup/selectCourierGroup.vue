<template>
	<div style="position: relative;">
		<v-select
			label="name"
			@search="onSearch"
			@input="input"
			:options="groups"
			:placeholder="placeholder"
			:filterable="false"
			:disabled="disabled"
			:reduce="reduce => reduce.id"
			:value="group"
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
				groups: [],
				group: null,
				disabledBtn: true,
				newGroupName: '',
			};
		},
		components: {
			vSelect,
			BIconPlusSquare,
		},
        watch: {
            'value'() {
				if (!this.value) {
					this.group = null;
					return;
				}
                this.getGroup(this.value);
                window.setTimeout(() => {
                    this.fetchGroups(
                        this.group ? this.group.name : '',
                        null,
                        this,
                        (id) => id,
                    );
                }, 0);
				this.getGroup(this.value)
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
					this.fetchGroups(search, loading, this);
				};
			},
			fetchGroups: _.debounce((search, loading, vm, callback) => {
				vm.$api.couriers.getCourierGroups({
                    search,
                    limit: 100,
                }).then((response) => {
					vm.groups = response.data.results;
                    if (vm.groups.length && callback) {
                        callback(vm.groups[0].id);
                    }
					loading ? loading(false) : null;
				});
			}, 500),
            async getGroup(id) {
                await this.$api.couriers.getCourierGroup(id).then((response) => {
					this.group = response.data;
				});
            },
			input(group) {
                // console.log('group - ', group);
				this.$emit("input", group);
				this.disabledBtn = true;
			},
			changeSearchValue:_.debounce((groupName, vm)  => {
				vm.newGroupName = groupName;
				vm.checkGroup();
			}, 500),
			checkGroup() {
				if (this.groups.findIndex(
                    group => group.name 
							? (
								this.newGroupName 
									? group.name.toLowerCase() === this.newGroupName.toLowerCase()
									: null
								) 
							: null
						) === -1) {
					this.disabledBtn = false;
				};
			},
			
		},
		mounted() {
			this.value ? this.getGroup(this.value) : this.fetchGroups("", null, this);
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
