<template>
	<div>
		<table-tree
			v-if="isVisibleTableTree"
			:table-params="tableParams"
			:data="data"
			:row-fields="rowFields"
			:thead="thead"
			@getData="getAllUsers"
			@rowClick="rowClick"
			@fieldClick="fieldClick"
			@sort="sortTable"
			@editItem="editItem"
			@deleteItem="deleteItem"
		/>
	</div>
</template>

<script>
import TableTree from "./TableTree.vue";

export default {
	name: "PrimerComponent",
	components: {
		TableTree,
	},
	props: {},
	data() {
		return {
			tabIndex: 0,
			isVisibleFilter: true,
			isVisibleTableTree: false,
			activeExtraOptionsPrompt: false,
			developerOptions: [
				{
					name: "Test - 1",
					id: 1,
				},
				{
					name: "Test - 2",
					id: 2,
				},
				{
					name: "Test - 3",
					id: 3,
				},
				{
					name: "Test - 4",
					id: 4,
				},
			],
			apartmentSignOptions: [
				{
					name: "Веломеста",
					id: 1,
				},
				{
					name: "Кладовые",
					id: 2,
				},
				{
					name: "Офисы",
					id: 3,
				},
				{
					name: "Разовый сбор на ОДПУ тепла",
					id: 4,
				},
			],
			testOptions: ["Не учитывать", "Есть", "Нет"],
			extraOptions: {
				by_bank_date: null,
				only_closed_PM: false,
				developer: null,
				only_benefiary: false,
				HVS: "Не учитывать",
				GVS: "Не учитывать",
				TS: "Не учитывать",
				GS: "Не учитывать",
				AL: "Не учитывать",
				apartmentSign: null,
				apartmentSignCheckbox: "Не учитывать",
				apartmentСoefficient: "Не учитывать",
				apartmentСoefficientText: "",
				take_date_changed: false,
				date_changed: null,
				antenna: "Не учитывать",
				elevator: "Не учитывать",
				radio: "Не учитывать",
			},
			filter: {
				accrued_from: "",
				accrued_by: "",
				directions: null,
				residental: true,
				non_residental: true,
				parking: true,
				typesOwn: null,
				allApartments: true,
				porchs: null,
				flats: null,
				tenantType: null,
				address: "",
				groupHomes: "",
				allHomes: null,

				// by_bank_date: null,
				// only_closed_PM: false,
				// developer: null,
				// only_benefiary: false,
				// HVS: "Не учитывать",
				// GVS: "Не учитывать",
				// TS: "Не учитывать",
				// GS: "Не учитывать",
				// AL: "Не учитывать",
				// apartmentSign: null,
				// apartmentSignCheckbox: "Не учитывать",
				// apartmentСoefficient: "Не учитывать",
				// apartmentСoefficientText: "",
				// take_date_changed: false,
				// date_changed: null,
				// antenna: "Не учитывать",
				// elevator: "Не учитывать",
				// radio: "Не учитывать",
				// status: "",
				// name: "",
				// isApartment: false,
				// date_created: moment(new Date(Date.now())).format("YYYY-MM-DD"),
			},
			// filterFields: [
			// 	{
			// 		fieldType: fieldType.DATEPICKER,
			// 		id: "accrued_from",
			// 		name: "Начислено с:",
			// 		keyName: "accrued_from",
			// 		value: "",
			// 		label: "Начислено с",
			// 		placeholder: "DD-MM-YYYY",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// 	{
			// 		fieldType: fieldType.DATEPICKER,
			// 		id: "accrued_by",
			// 		name: "Начислено по:",
			// 		keyName: "accrued_by",
			// 		value: "",
			// 		label: "Начислено по",
			// 		placeholder: "DD-MM-YYYY",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// 	{
			// 		fieldType: fieldType.SELECT,
			// 		options: this.directions,
			// 		label: "Направления:",
			// 		placeholder: "",
			// 		name: "title",
			// 		keyName: "directions",
			// 		reduce: (item) => item.id,
			// 		value: null,
			// 		multiple: true,
			// 		filterable: true,
			// 		width: 8,
			// 		style: {},
			// 		searchable: false,
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		getMethod: (data) => {
			// 			console.log(data);
			// 			return this.$api.news.news.getNews(data);
			// 		},
			// 	},
			// 	{
			// 		fieldType: fieldType.CHECKBOX,
			// 		name: "residental",
			// 		keyName: "residental",
			// 		type: "text",
			// 		value: "",
			// 		label: "Жилые",
			// 		placeholder: "Жилые",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// 	{
			// 		fieldType: fieldType.CHECKBOX,
			// 		name: "non_residental",
			// 		keyName: "non_residental",
			// 		type: "text",
			// 		value: "",
			// 		label: "Нежилые",
			// 		placeholder: "Нежилые",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// 	{
			// 		fieldType: fieldType.CHECKBOX,
			// 		name: "parking",
			// 		keyName: "parking",
			// 		type: "text",
			// 		value: "",
			// 		label: "Паркинг",
			// 		placeholder: "Паркинг",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// 	{
			// 		fieldType: fieldType.SELECT,
			// 		options: [
			// 			{
			// 				name: "По всем видам собственности",
			// 			},
			// 			{
			// 				name: "Госсобственность",
			// 			},
			// 			{
			// 				name: "Муниципальная собственность",
			// 			},
			// 			{
			// 				name: "Частная собственность",
			// 			},
			// 		],
			// 		// label: "По всем видам собственности:",
			// 		placeholder: "По всем видам собственности",
			// 		name: "name",
			// 		keyName: "typesOwn",
			// 		reduce: (item) => item.value,
			// 		value: "По всем видам собственности",
			// 		multiple: false,
			// 		filterable: true,
			// 		width: 6,
			// 		style: {
			// 			// backgroundColor: "red",
			// 		},
			// 		searchable: false,
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		// getMethod: (data) => {
			// 		// 	console.log(data);
			// 		// 	return this.$api.news.news.getNews(data);
			// 		// },
			// 	},
			// 	{
			// 		fieldType: fieldType.CHECKBOX,
			// 		name: "allApartments",
			// 		keyName: "allApartments",
			// 		type: "text",
			// 		value: "",
			// 		label: "Все дома",
			// 		placeholder: "Все дома",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// 	{
			// 		fieldType: fieldType.CHECKBOX,
			// 		name: "porchs",
			// 		keyName: "porchs",
			// 		type: "text",
			// 		value: "",
			// 		label: "Подъезды",
			// 		placeholder: "Подъезды",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// 	{
			// 		fieldType: fieldType.CHECKBOX,
			// 		name: "flats",
			// 		keyName: "flats",
			// 		type: "text",
			// 		value: "",
			// 		label: "Квартиры",
			// 		placeholder: "Квартиры",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// 	{
			// 		fieldType: fieldType.SELECT,
			// 		options: [
			// 			{
			// 				name: "Не учитывать тип жителя",
			// 			},
			// 			{
			// 				name: "Физическое лицо",
			// 			},
			// 			{
			// 				name: "Юридическое лице",
			// 			},
			// 		],
			// 		// label: "По всем видам собственности:",
			// 		placeholder: "Не учитывать тип жителя",
			// 		name: "name",
			// 		keyName: "tenantType",
			// 		reduce: (item) => item,
			// 		value: "Не учитывать тип жителя",
			// 		multiple: false,
			// 		filterable: true,
			// 		width: 6,
			// 		style: {
			// 			// backgroundColor: "red",
			// 		},
			// 		searchable: false,
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		// getMethod: (data) => {
			// 		// 	console.log(data);
			// 		// 	return this.$api.news.news.getNews(data);
			// 		// },
			// 	},
			// 	// {
			// 	// 	fieldType: fieldType.INPUT,
			// 	// 	name: "testInput",
			// 	// 	keyName: "name",
			// 	// 	type: "text",
			// 	// 	value: "",
			// 	// 	label: "text",
			// 	// 	placeholder: "testInput",
			// 	// 	onChange: (event, item) => {
			// 	// 		item.value = event;
			// 	// 		this.filter[item.keyName] = item.value;
			// 	// 	},
			// 	// 	width: 3,
			// 	// 	style: {},
			// 	// },
			// 	// {
			// 	// 	fieldType: fieldType.CHECKBOX,
			// 	// 	name: "testInput",
			// 	// 	keyName: "isApartment",
			// 	// 	type: "text",
			// 	// 	value: "",
			// 	// 	label: "text",
			// 	// 	placeholder: "testInput",
			// 	// 	onChange: (event, item) => {
			// 	// 		item.value = event;
			// 	// 		this.filter[item.keyName] = item.value;
			// 	// 	},
			// 	// 	width: 3,
			// 	// },
			// 	{
			// 		fieldType: fieldType.COMPONENT,
			// 		component: "vx-select",
			// 		width: 4,
			// 		// component: {
			// 		// 	name: "TextNode",
			// 		// 	template: `<div>
			// 		// 		<vx-select :item="{
			// 		// 		isGroupHomes: false,
			// 		// 		name: 'title',
			// 		// 		label: 'value',
			// 		// 		keyName: 'address',
			// 		// 		value: null,
			// 		// 		reduce: (item) => item.id,
			// 		// 		getMethod: (data) => {
			// 		// 			return this.$api.news.news.getNews(data);
			// 		// 		},
			// 		// 		onChange: (event, item) => {
			// 		// 			item.value = event;
			// 		// 			this.filter[item.keyName] = item.value;
			// 		// 		},
			// 		// 	}" />
			// 		// 	</div>`,
			// 		// },
			// 		componentProps: {
			// 			item: {
			// 				isGroupHomes: false,
			// 				name: "title",
			// 				label: "Группы домов",
			// 				placeholder: "Введите адрес...",
			// 				labelStyle: {
			// 					marginBottom: "5px",
			// 					color: "blue",
			// 					borderBottom: "1px dashed blue",
			// 				},
			// 				clickLabel: (item) => {
			// 					item.isGroupHomes = !item.isGroupHomes;
			// 					if (item.isGroupHomes) {
			// 						item.label = "Выбор домов по адресу";
			// 						item.placeholder = "Выберите группу домов...";
			// 						return;
			// 					}
			// 					item.label = "Группы домов";
			// 					item.placeholder = "Введите адрес...";
			// 				},
			// 				keyName: "address",
			// 				value: null,
			// 				multiple: true,
			// 				reduce: (item) => item.id,
			// 				getMethod: (data) => {
			// 					return this.$api.news.news.getNews(data);
			// 				},
			// 				onChange: (event, item) => {
			// 					item.value = event;
			// 					this.filter[item.keyName] = item.value;
			// 				},
			// 			},
			// 		},
			// 	},
			// 	{
			// 		fieldType: fieldType.CHECKBOX,
			// 		name: "allHomes",
			// 		keyName: "allHomes",
			// 		type: "text",
			// 		value: "",
			// 		label: "Все дома",
			// 		placeholder: "Все дома",
			// 		onChange: (event, item) => {
			// 			item.value = event;
			// 			this.filter[item.keyName] = item.value;
			// 		},
			// 		width: 2,
			// 	},
			// ],
			testData: [
				{
					name: "test - 1",
					value: 1,
					testColumn: {
						component: "vx-select",
						// component: {
						// 	name: "TextNode",
						// 	template: `<vx-select :item="{
						// 		name: 'status',
						// 		label: 'status',
						// 		options: [{ value: 'Принято' }, { value: 'Отказано' }],
						// 		value: 'Принято',
						// 		reduce: (item) => item.value,
						// 	}" />`,
						// },
						componentProps: {
							item: {
								name: "value",
								label: "value",
								options: [{ value: "Принято" }, { value: "Отказано" }],
								value: "Принято",
								reduce: (item) => item.value,
							},
						},
					},
					text: "text 1",
					style: {
						color: "red",
					},
					children: [
						{
							name: "child test - 1",
							value: 11,
							text: "text 1",
							children: [
								{
									name: "child child test - 1",
									value: 111,
									text: "text 1",
								},
								{
									name: "child child test - 2",
									value: 122,
									text: "text 1",
									children: [
										{
											name: "child child child test - 1",
											value: 111,
											text: "text 1",
										},
										{
											name: "child child child test - 2",
											value: 122,
											text: "text 1",
										},
									],
								},
							],
						},
						{
							name: "child test - 2",
							value: 12,
							text: "text 1",
							children: [
								{
									name: "child child child test - 1",
									value: 111,
									text: "text 1",
								},
								{
									name: "child child child test - 2",
									value: 122,
									text: "text 1",
								},
							],
						},
					],
				},
				{
					name: "test - 2",
					value: 2,
					text: "text 1",
					style: {
						color: "blue",
					},
				},
			],
			tableParams: {
				changeCountElements: true,
				stripe: true,
				search: false,
				pagination: true,
				maxItems: 20,
				totalPagePagination: 0,
				actions: {
					edit: true,
					delete: true,
				},
				style: {
					marginTop: "20px",
					border: "1px solid red",
				},
			},
			testThead: [
				{
					columnName: "Наименование",
					style: {
						color: "red",
					},
				},
				{
					columnName: "Значение",
					component: "vs-input",
					// component: {
					// 	name: "TextNode",
					// 	template: `<vx-select :item="{
					// 		name: 'status',
					// 		label: 'status',
					// 		options: [{ value: 'Принято' }, { value: 'Отказано' }],
					// 		value: 'Принято',
					// 		reduce: (item) => item.value,
					// 	}" />`,
					// },
					componentProps: {
						item: {
							name: "value",
							value: "Принято",
							style: {
								backgroundColor: "red",
							},
						},
					},
				},
				{
					columnName: "Тестовая колонка",
				},
				{
					columnName: "Текст",
				},
				{
					columnName: "Действия",
				},
			],
			thead: [
				{
					columnName: "id",
				},
				{
					columnName: "date_of_creation",
				},
				{
					columnName: "home",
				},
				{
					columnName: "payments_received",
				},
				{
					columnName: "payments_total",
				},
				{
					columnName: "Действия",
				},
			],
			rowFields: [
				{
					key: "id",
				},
				{
					key: "date_of_creation",
				},
				{
					key: "home",
				},
				{
					key: "payments_received",
				},
				{
					key: "payments_total",
				},
			],
			data: null,
		};
	},
	computed: {},
	watch: {
		"$route.params.tabIndex": {
			handler(nextValue) {
				this.tabIndex = Number(nextValue);
			},
			immediate: true,
		},
		tabIndex(nextValue) {
			if (nextValue !== Number(this.$route.params.tabIndex)) {
				this.$router.replace({ params: { tabIndex: nextValue } });
			}
		},
	},
	mounted() {
		this.tabIndex = Number(this.$route.params.tabIndex);
	},
	methods: {
		saveFilter() {
			console.log(this.filter);
			//Здесь отправлять запрос на создание отчета
		},
		getAllUsers(filter) {
			console.log('1');
			this.$vs.loading();
			this.$load(async () => {
				const res = await this.$api.homes.accrual.getAccruals(filter);
				this.tableParams.totalPagePagination = Math.ceil(res.data.count / filter.limit);
				this.data = res.data.results;
				this.$vs.loading.close();
			});
		},
		rowClick(row) {
			console.log("Parent - ", row);
		},
		fieldClick(field) {
			console.log("Parent - ", field);
		},
		sortTable(sortName) {
			console.log(sortName);
		},
		editItem(item) {
			console.log("editItem - ", item);
		},
		deleteItem(item) {
			console.log("deleteItem - ", item);
		},
		downloadReport() {
			console.log("Rablotaet");
			// downloadExcel("https://speed.hetzner.de/100MB.bin");
		},
		clearFilter() {
			this.filter = {
				...this.filter,
				by_bank_date: null,
				only_closed_PM: false,
				developer: null,
				only_benefiary: false,
				HVS: "Не учитывать",
				GVS: "Не учитывать",
				TS: "Не учитывать",
				GS: "Не учитывать",
				AL: "Не учитывать",
				apartmentSign: null,
				apartmentSignCheckbox: "Не учитывать",
				apartmentСoefficient: "Не учитывать",
				apartmentСoefficientText: "",
				take_date_changed: false,
				date_changed: null,
				antenna: "Не учитывать",
				elevator: "Не учитывать",
				radio: "Не учитывать",
			};
		},
		closePopup() {
			this.activeExtraOptionsPrompt = false;
		},
		saveExtraOptions() {
			this.filter = {
				...this.filter,
				...this.extraOptions,
			};
			this.activeExtraOptionsPrompt = false;
		},
		createTableTree() {
			this.isVisibleTableTree = true;
			this.isVisibleFilter = false;
		},
	},
};
</script>

<style lang="scss">
.metersItem {
	flex: 0 0 33.3333%;
	padding: 0 5px;
}
.apartmentSign {
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	background-color: rgba(0, 0, 0, 0.05);
}
.con-vs-popup .vs-popup {
	width: 75vw !important;
	height: auto !important;
}
</style>
