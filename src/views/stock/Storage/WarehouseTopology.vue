<template>
	<div>
		<b-card>
			<b-row>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
                        @search="onSearchZone"
						:reduce="(item) => item.id"
						:options="zones"
						placeholder="Зона"
						:filterable="false"
						v-model="filters.zone"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
                        @search="onSearchRack"
						:reduce="(item) => item.id"
						:options="racks"
						placeholder="Стеллаж"
						:filterable="false"
						v-model="filters.rack"
						:disabled="filters.zone || filters.rack ? false : true"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
						@search="onSearchShelf"
						:reduce="(item) => item.id"
						:options="shelves"
						placeholder="Полка"
						:filterable="false"
						v-model="filters.shelf"
						:disabled="filters.rack || filters.shelf ? false : true"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
			</b-row>
			<template #footer>
				<a 
					class="filter-orders__btn" 
					@click="() => resetFilters()"
				>
					<feather-icon icon="XCircleIcon" size="12" />
					<span class="filter-orders__btn-text"> Сбросить все фильтры </span>
				</a>
			</template>
		</b-card>
		<b-card style="margin-top: 20px;">
			<div class="mb-1 d-flex align-items-center justify-content-between">
				<span>
					Найдено: <b>{{ count }}</b>
				</span>
			</div>
			<b-table 
				:items="stocks"
				:fields="fields"
				striped
				responsive
				@row-clicked="(item) => handleStockRowClicked(item)"
			>
				<template #cell(name)="data" >
					<span>
						{{data.item.name}}
					</span>
					<feather-icon
						:icon="'ChevronDownIcon'"
						size="18"
					/>
				</template>
				<template #cell(action)="data" >
					<b-button
						class="mr-2"
						variant="success"
						@click="() => checkStockId(data.item.id)"
						v-b-modal.modal-prevent-closing-zone
					>
						Добавить зону
					</b-button>
					<b-button 
						variant="danger"
						@click="() => checkStockId(data.item.id)"
						v-b-modal.modal-delete-stock
					>
						Удалить склад
					</b-button>
					<b-modal
						id="modal-prevent-closing-zone"
						ref="modal"
						title="Введите имя зоны"
						@show="resetZoneModal"
						@hidden="resetZoneModal"
						@ok="(event) => handleZoneOk(event, data.item)"
					>
						<form ref="form" @submit.stop.prevent="handleZoneSubmit">
							<b-form-group
								label="Имя зоны"
								label-for="zone-input"
								invalid-feedback="Zone is required"
								:state="zoneState"
							>
								<b-form-input
									id="zone-input"
									v-model="zone"
									:state="zoneState"
									required
								>
								</b-form-input>
							</b-form-group>
						</form>
					</b-modal>
				</template>
				<template #row-details="data">
					<div v-if="data.item.zones && !data.item.zones.length">
						<h5>Ничего не найдено</h5>
					</div>
					<b-table
						v-else
						:items="data.item.zones"
						:fields="zoneFields"
						striped
						responsive
						@row-clicked="(item) => handleZoneRowClicked(data.item.id, item)"
					>
						<template #cell(name)="data" >
							<span>
								{{data.item.name}}
							</span>
							<feather-icon
								:icon="'ChevronDownIcon'"
								size="18"
							/>
						</template>
						<template #cell(action)="data">
							<b-button
								class="mr-2"
								variant="success"
								v-b-modal.modal-prevent-closing-rack
								@click="() => checkZoneId(data.item.id)"
							>
								Добавить стеллаж
							</b-button>
							<b-button 
								variant="danger" 
								v-b-modal.modal-delete-zone
							>
								Удалить зону
							</b-button>
							<b-modal
								id="modal-prevent-closing-rack"
								ref="modal"
								title="Введите имя стеллажа"
								@show="resetRackModal"
								@hidden="resetRackModal"
								@ok="(event) => handleRackOk(event, data.item.id)"
							>
								<form ref="form" @submit.stop.prevent="handleRackSubmit">
									<b-form-group
										label="Имя стеллажа"
										label-for="rack-input"
										invalid-feedback="Rack is required"
										:state="rackState"
									>
										<b-form-input
											id="rack-input"
											v-model="rack"
											:state="rackState"
											required
										>
										</b-form-input>
									</b-form-group>
								</form>
							</b-modal>
							<b-modal
								id="modal-delete-zone"
								title="Удалить?"
								@ok="() => handleDeleteZone(data)"
								ok-title="Удалить"
								ok-variant="danger"
								header-bg-variant="danger"
								cancel-title="Отмена"
								size="sm"
							>
								<p>Удалить зону?</p>
							</b-modal>
						</template>
						<template #row-details="data">
							<div v-if="data.item.racks && !data.item.racks.length">
								<h5>Ничего не найдено</h5>
							</div>
							<b-table
								v-else
								class="w-100"
								:items="data.item.racks"
								:fields="rackFields"
								striped
								responsive
								@row-clicked="(item) => handleRackRowClicked(data.item, data.item.id, item)"
							>
								<template #cell(name)="data" >
									<span>
										{{data.item.name}}
									</span>
									<feather-icon
										:icon="'ChevronDownIcon'"
										size="18"
									/>
								</template>
								<template #cell(action)="data">
									<b-button
										class="mr-2"
										variant="success"
										v-b-modal.modal-prevent-closing-shelf
										@click="() => checkRackId(data.item.id)"
									>
										Добавить полку
									</b-button>
									<b-button  
										variant="danger" 
										v-b-modal.modal-delete-rack
									>
										Удалить стеллаж
									</b-button>
									<b-modal
										id="modal-prevent-closing-shelf"
										ref="modal"
										title="Введите имя полки"
										@show="resetShelfModal"
										@hidden="resetShelfModal"
										@ok="(event) => handleShelfOk(event, data.item.id)"
									>
										<form ref="form" @submit.stop.prevent="handleShelfSubmit">
											<b-form-group
												label="Имя полки"
												label-for="shelf-input"
												invalid-feedback="Shelf is required"
												:state="shelfState"
											>
												<b-form-input
													id="shelf-input"
													v-model="shelf"
													:state="shelfState"
													required
												>
												</b-form-input>
											</b-form-group>
										</form>
									</b-modal>
									<b-modal
										id="modal-delete-rack"
										title="Удалить?"
										@ok="() => handleDeleteRack(data)"
										ok-title="Удалить"
										ok-variant="danger"
										header-bg-variant="danger"
										cancel-title="Отмена"
										size="sm"
									>
										<p>Удалить стеллаж?</p>
									</b-modal>
								</template>
								<template #row-details="data">
									<div v-if="data.item.shelves && !data.item.shelves.length">
										<h5>Ничего не найдено</h5>
									</div>
									<b-table
										v-else
										:items="data.item.shelves"
										:fields="shelfFields"
										striped
										responsive
										@row-clicked="(item) => handleShelfRowClicked(data, item)"
									>
										<template #cell(name)="data" >
											<span>
												{{data.item.name}}
											</span>
											<feather-icon
												:icon="'ChevronDownIcon'"
												size="18"
											/>
										</template>
										<template #cell(action)="data">
											<b-button 
												v-b-modal.modal-delete-shelf 
												variant="danger"
											>
												Удалить полку
											</b-button>
											<b-modal
												id="modal-delete-shelf"
												title="Удалить?"
												@ok="() => handleDeleteShelf(data)"
												ok-title="Удалить"
												ok-variant="danger"
												header-bg-variant="danger"
												cancel-title="Отмена"
												size="sm"
											>
												<p>Удалить полку?</p>
											</b-modal>
										</template>
										<template #row-details="data">
											<b-card class="mb-1">
												<h5>Полка №{{data.item.id}}</h5>
												<div v-if="data.item.storedOrders && !data.item.storedOrders.length">
													<h5>Полка пуста</h5>
												</div>
												<b-table
													v-else
													:items="data.item.storedOrders"
													:fields="shelfInfoFields"
													striped
													responsive
												>
													<template #cell(date_created)="data">
														{{ formatDate(data.item.date_created) }}
													</template>
												</b-table>
											</b-card>	
										</template>
									</b-table>
								</template>
							</b-table>
						</template>
					</b-table>
                </template>
			</b-table>
			
			<b-button
				class="mt-1"
				variant="success"
				v-b-modal.modal-prevent-closing-stock
			>
				Добавить склад
			</b-button>

			<b-modal
				id="modal-prevent-closing-stock"
				ref="modal"
				title="Введите имя склада"
				@show="resetStockModal"
				@hidden="resetStockModal"
				@ok="handleStockOk"
			>
				<form ref="form" @submit.stop.prevent="handleStockSubmit">
					<b-form-group
						label="Имя склада"
						label-for="stock-input"
						invalid-feedback="Stock is required"
						:state="stockState"
					>
						<b-form-input
							id="stock-input"
							v-model="stock"
							:state="stockState"
							required
						>
						</b-form-input>
					</b-form-group>
				</form>
			</b-modal>
			<b-modal
				id="modal-delete-stock"
				title="Удалить?"
				@ok="handleDeleteStock"
				ok-title="Удалить"
				ok-variant="danger"
				header-bg-variant="danger"
				cancel-title="Отмена"
				size="sm"
			>
				<p>Удалить склад?</p>
			</b-modal>
			<b-pagination
				v-if="showPagination"
				:total-rows="count"
				:per-page="perPage"
				@change="changePage"
				:value="curPage"
				align="right"
			/>
		</b-card>
	</div>
</template>

<script>
	import { mapGetters, mapActions, mapMutations } from "vuex";
	import vSelect from 'vue-select'
	import {
		BRow,
		BCol,
		BCard,
		BTable,
		BButton,
		BCollapse,
		VBToggle,
		BPagination,
		BIconXCircle,
		BFormCheckbox,
		BImg,
		BFormInput,
		BFormGroup,
	} from "bootstrap-vue";
	import { RoleConstants } from '@/utils/role';
	import store from "@/store/index";
	export default {
		data() {
			return {
				stock: '',
				stockState: null,
				stockIdValue: null, 
				zone: '',
				zoneState: null,
				zoneIdValue: null,
				rack: '',
				rackState: null,
				rackIdValue: null,
				shelf: '',
				shelfState: null,
				visible: false,
				fields: [
					{ key: "name", label: "СКЛАД", class: "col-6" },
					{ key: "action", label: "ДЕЙСТВИЕ", class: "col-7" },
					{ key: "show_details", label: "" },
				],
				zoneFields: [
					{ key: "name", label: "ЗОНА", class: "col-4" },
					{ key: "action", label: "ДЕЙСТВИЕ", class: "col-7" },
					{ key: "show_details", label: "" },
				],
				rackFields: [
					{ key: "name", label: "СТЕЛЛАЖ" },
					{ key: "action", label: "ДЕЙСТВИЕ" },
					{ key: "show_details", label: "" },
				],
				shelfFields: [
					{ key: "name", label: "ПОЛКА" },
					{ key: "action", label: "ДЕЙСТВИЕ" },
					{ key: "show_details", label: "" },
				],
				shelfInfoFields: [
					{ key: "id", label: "НОМЕР" },
					{ key: "date_created", label: "ДАТА РЕГИСТРАЦИИ" },
					{ key: "status", label: "СТАТУС" },
					{ key: "user_created", label: "СОЗДАТЕЛЬ" },
				],
				zones: [],
                racks: [],
                shelves: []
			};
		},
		components: {
			BRow,
			BCol,
			BCard,
			BTable,
			BButton,
			BCollapse,
			BIconXCircle,
			BFormCheckbox,
			BImg,
			BPagination,
			vSelect,
			BFormInput,
			BFormGroup,
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
			filters: {
				handler() {
					if (!this.filters.zone) {
						this.filters.rack = null;
					}

					if (!this.filters.rack) {
						this.filters.shelf = null;
					}

					this.fetchStocks();
				},
				deep: true
			}
		},
		computed: {
			showPagination() {
				return Math.ceil(this.count / this.perPage) > 1;
			},
			readOnly() {
				return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
			},
			...mapGetters({
				count: "moduleWarehouseTopology/getCount",
				perPage: "moduleWarehouseTopology/getCountPerPage",
				curPage: "moduleWarehouseTopology/getCurPage",
				filters: "moduleWarehouseTopology/getFilters",
				stocks: "moduleWarehouseTopology/getStocks",
			}),
		},
		methods: {
			...mapMutations({
				setFilters: "moduleWarehouseTopology/setFilters",
				changeCurPage: "moduleWarehouseTopology/changePage",
			}),
            ...mapActions({
				resetPagination: "moduleWarehouseTopology/resetPagination",
				resetFilters: "moduleWarehouseTopology/resetFilters",
				fetchStocks: "moduleWarehouseTopology/fetchStocks",
			}),
			formatDate(date) {
				return this.dayjs(date).format("DD.MM.YYYY");
			},
			onSearchZone(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchZone(search, loading, this);
				}
            },
            fetchZone: _.debounce((search, loading, vm) => {
				vm.$api.addressBasedStorage.getZones({ search, limit: 100 })
                    .then((response) => {
                        vm.zones = [...response.data.results];
                        loading(false);
                    });
			}, 500),
            onSearchRack(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchRack(search, loading, this);
				}
            },
            fetchRack: _.debounce((search, loading, vm) => {
				vm.$api.addressBasedStorage.getRacks({ search, limit: 100, zone: vm.filters.zone })
                    .then((response) => {
                        vm.racks = [...response.data.results];
                        loading(false);
                    });
			}, 500),
            onSearchShelf(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchShelf(search, loading, this);
				}
            },
            fetchShelf: _.debounce((search, loading, vm) => {
				vm.$api.addressBasedStorage.getShelves({ search, limit: 100, rack: vm.filters.rack })
                    .then((response) => {
                        vm.shelves = [...response.data.results];
                        loading(false);
                    });
			}, 500),
			handleStockRowClicked(item) {
				this.$set(item, '_showDetails', !item._showDetails); 
				let index = this.stocks.findIndex(stock => stock.id === item.id);
				this.$api.addressBasedStorage.getZones({ limit: 100, stock: item.id })
                    .then((response) => {
						let stockWithZones = {
							...item,
							zones: [...response.data.results] 
						}
						this.stocks.splice(index, 1, stockWithZones);
                    });
			},
			handleZoneRowClicked(id, item) {
				this.$set(item, '_showDetails', !item._showDetails); 
				let parentIndex = this.stocks.findIndex(stock => stock.id === id);
				let index = this.stocks[parentIndex].zones.findIndex(zone => zone.id === item.id);
				this.$api.addressBasedStorage.getRacks({ limit: 100, zone: item.id })
					.then((response) => {
						let racksResult = response.data.results.map(item => item = {...item, stock: id})
						let zoneWithRacks = {
							...item,
							racks: [...racksResult] 
						}
						this.stocks[parentIndex].zones.splice(index, 1, zoneWithRacks);
					});
			},
			handleRackRowClicked(zone,  zoneId, item) {
				this.$set(item, '_showDetails', !item._showDetails); 
				let stockIndex = this.stocks.findIndex(stock => stock.id === zone.stock);
				let zoneIndex = this.stocks[stockIndex].zones.findIndex(zone => zone.id === zoneId);
				let index = this.stocks[stockIndex].zones[zoneIndex].racks.findIndex(racks => racks.id === item.id);

				this.$api.addressBasedStorage.getShelves({ limit: 100, rack: item.id })
					.then((response) => {
						let rackWithShelves = {
							...item,
							shelves: [...response.data.results] 
						}
						this.stocks[stockIndex].zones[zoneIndex].racks.splice(index, 1, rackWithShelves);
					});
			},
			handleShelfRowClicked(data, item) {
				this.$set(item, '_showDetails', !item._showDetails);
				let stockIndex = this.stocks.findIndex(stock => stock.id === data.item.stock);
				let zoneIndex = this.stocks[stockIndex].zones.findIndex(zone => zone.id === data.item.zone);
				let shelfIndex = this.stocks[stockIndex].zones[zoneIndex].racks[data.index].shelves.findIndex(shelf => shelf.id === item.id);
				this.$api.addressBasedStorage.getStoredOrders({shelf: item.id})
					.then((response) => {
							let shelfWithInfo = {
								...item,
								storedOrders: response.data.results 
							}
							this.stocks[stockIndex].zones[zoneIndex].racks[data.index].shelves.splice(shelfIndex, 1, shelfWithInfo)
						})
			},
			checkStockId(id) {
				this.stockIdValue = id
			},
			checkZoneId(id) {
				this.zoneIdValue = id
			},
			checkRackId(id) {
				this.rackIdValue = id
			},
			handleAddStock() {
				this.$api.addressBasedStorage.createStock({name: this.stock})
					.then((response) => {
							this.fetchStocks();
						})
			},
			handleDeleteStock() {
				this.$api.addressBasedStorage.deleteStock(this.stockIdValue)
					.then((response) => {
							this.fetchStocks();
						})
			},
			handleAddZone() {
				this.$api.addressBasedStorage.createZone({name: this.zone, stock: this.stockIdValue})
					.then((response) => {
							this.stockIdValue = null
							this.fetchStocks();
						})
			},
			handleDeleteZone(zoneData) {
				this.$api.addressBasedStorage.deleteZone(zoneData.item.id)
					.then((response) => {
							this.fetchStocks();
						})
			},
			handleAddRack() {
				this.$api.addressBasedStorage.createRack({name: this.rack, zone: this.zoneIdValue})
					.then((response) => {
							this.zoneIdValue = null;
							this.fetchStocks();
						})
			},
			handleDeleteRack(rackData) {
				this.$api.addressBasedStorage.deleteRack(rackData.item.id)
					.then((response) => {
							this.fetchStocks();
						})
			},
			handleAddShelf() {
				this.$api.addressBasedStorage.createShelf({name: this.shelf, rack: this.rackIdValue})
					.then((response) => {
							this.rackIdValue = null;
							this.fetchStocks();
						})
			},
			handleDeleteShelf(shelfData) {
				this.$api.addressBasedStorage.deleteShelf(shelfData.item.id)
					.then((response) => {
							this.fetchStocks();
						})
			},
			checkStockFormValidity() {
				const valid = this.$refs.form.checkValidity()
				this.stockState = valid
				return valid
			},
			resetStockModal() {
				this.stock = ''
				this.stockState = null
			},
			handleStockOk(bvModalEvent) {
				bvModalEvent.preventDefault()
				this.handleStockSubmit()
			},
			handleStockSubmit() {
				if (!this.checkStockFormValidity()) {
					return
				}
				this.handleAddStock();
				this.$nextTick(() => {
					this.$bvModal.hide('modal-prevent-closing-stock')
				})
			},

			checkZoneFormValidity() {
				const valid = this.$refs.form.checkValidity()
				this.zoneState = valid
				return valid
			},
			resetZoneModal() {
				this.zone = ''
				this.zoneState = null
			},
			handleZoneOk(bvModalEvent) {
				bvModalEvent.preventDefault()
				this.handleZoneSubmit()
			},
			handleZoneSubmit() {
				if (!this.checkZoneFormValidity()) {
					return
				}
				this.handleAddZone();
				this.$nextTick(() => {
					this.$bvModal.hide('modal-prevent-closing-zone')
				})
			},

			checkRackFormValidity() {
				const valid = this.$refs.form.checkValidity()
				this.rackState = valid
				return valid
			},
			resetRackModal() {
				this.rack = ''
				this.rackState = null
			},
			handleRackOk(bvModalEvent) {
				bvModalEvent.preventDefault()
				this.handleRackSubmit()
			},
			handleRackSubmit() {
				if (!this.checkRackFormValidity()) {
					return
				}
				this.handleAddRack();
				this.$nextTick(() => {
					this.$bvModal.hide('modal-prevent-closing-rack')
				})
			},

			checkShelfFormValidity() {
				const valid = this.$refs.form.checkValidity()
				this.shelfState = valid
				return valid
			},
			resetShelfModal() {
				this.shelf = ''
				this.shelfState = null
			},
			handleShelfOk(bvModalEvent, rackId) {
				console.log(rackId);
				bvModalEvent.preventDefault()
				this.handleShelfSubmit(rackId)
			},
			handleShelfSubmit(rackId) {
				if (!this.checkShelfFormValidity()) {
					return
				}
				this.handleAddShelf(rackId);
				this.$nextTick(() => {
					this.$bvModal.hide('modal-prevent-closing-shelf')
				})
			},
			changePage(page) {
				this.changeCurPage(page);
				this.fetchStocks();
			},
			fillOptions(vm) {
				vm.$api.addressBasedStorage.getZones({ limit: 100 })
                    .then((response) => {
                        vm.zones = [...response.data.results];
                    });
				vm.$api.addressBasedStorage.getRacks({ limit: 100 })
                    .then((response) => {
                        vm.racks = [...response.data.results];
                    });
				vm.$api.addressBasedStorage.getShelves({ limit: 100 })
                    .then((response) => {
                        vm.shelves = [...response.data.results];
                    });
			}
		},
		mounted() {
			this.fetchStocks();
			this.fillOptions(this); 
		},
	};
</script>

<style lang="scss" scoped>
	.whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }

</style>
