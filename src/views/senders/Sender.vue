<template>
	<section class="order pb-5">
		<b-overlay :show="loading" rounded="sm">
			<template v-if="message">
				<h1>{{ message }}</h1>
			</template>
			<template v-else>
				<h1 class="mb-2">Отправитель №{{ sender.id }}</h1>
				<b-row>
					<b-col>
						<b-card>
							<b-card-title>Основная информация</b-card-title>
							<table class="w-100">
								<tr>
									<td class="pb-1">Название / ФИО</td>
									<td class="pb-1">{{ sender.full_name }}</td>
								</tr>
								<tr>
									<td class="pb-1">Адрес</td>
									<td class="pb-1">{{ sender.address }}</td>
								</tr>
								<tr>
									<td class="pb-1">Город</td>
									<td class="pb-1">{{ sender.city.name }}</td>
								</tr>
								<tr>
									<td class="pb-1">Пасспортные данные</td>
									<td class="pb-1">{{ sender.passport_series }} {{ sender.passport_no }}</td>
								</tr>
								<tr>
									<td class="pb-1">Контрагент</td>
									<td class="pb-1">
										<router-link
											style="border-bottom: 1px dotted blue"
											:to="{
												name: 'client',
												params: { id: sender.counterparty.id },
											}"
										>
												{{ sender.counterparty.name }}
											</router-link>
									</td>
								</tr>
								<tr>
									<td class="pb-1">Тип контрагента</td>
									<td class="pb-1">{{ sender.counterparty_type }}</td>
								</tr>
							</table>
						</b-card>
					</b-col>
					<b-col>
						<b-card>
							<b-card-title>Контакты</b-card-title>
							<table class="w-100">
								<tr v-if="sender.sender_phones && sender.sender_phones.length">
									<td class="pb-1">Номера телефонов</td>
									<td class="pb-1">
										<p v-for="(phone, i) in sender.sender_phones" :key="i">
											<a :href="`tel:${phone.phone_number}`">
												{{ i + 1 }}. {{ phone.phone_number }}
											</a>
										</p>
									</td>
								</tr>
								<tr v-if="sender.email">
									<td class="pb-1">Email</td>
									<td class="pb-1">
										<a :href="`mailto:${sender.email}`">{{ sender.email }}</a>
									</td>
								</tr>
								<tr v-if="sender.web">
									<td class="pb-1">Сайт</td>
									<td class="pb-1">
										<a
											v-if="isValidHttpUrl(sender.web)"
											:href="sender.web"
											target="_blank"
										>
											{{ sender.web }}
										</a>
										<span v-else>{{ sender.web }}</span>
									</td>
								</tr>
							</table>
						</b-card>
					</b-col>
				</b-row>
				<b-button v-b-modal.modal-delete variant="danger">Удалить</b-button>
				<b-modal
					id="modal-delete"
					title="Удалить?"
					@ok="deleteSender"
					ok-title="Удалить"
					ok-variant="danger"
					header-bg-variant="danger"
					cancel-title="Отмена"
					size="sm"
				>
					<p>Удалить отправителя?</p>
				</b-modal>
			</template>
		</b-overlay>
	</section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
	BRow,
	BCol,
	BOverlay,
	BCard,
	BCardTitle,
	BTable,
	BButton,
} from "bootstrap-vue";

export default {
	components: {
		BRow,
		BCol,
		BOverlay,

		BCard,
		BCardTitle,
		BTable,
		BButton,
	},
	data() {
		return {
			sender: {},
			message: null,
		};
	},
	computed: {
		...mapGetters({
			loading: "moduleSenders/getLoading",
		}),
		idSender() {
			return this.$route.params.id || null;
		},
	},
	methods: {
		...mapMutations({
			changeLoading: "moduleSenders/changeLoading",
		}),
		fetchSender() {
			this.changeLoading(true);
			this.$api.senders
				.getSender(this.idSender)
				.then((response) => {
					if (response.status == 404) this.message = "Отправитель не найден";
					else this.sender = response.data;
					this.changeLoading(false);
				})
				.finally(() => this.changeLoading(false));
		},
		deleteSender() {
			this.changeLoading(true);
			this.$api.senders.deleteSender(this.idSender).then((response) => {
				this.changeLoading(false);
				this.$router.push({ name: "senders" });
			});
		},
	},
  	mounted() {
    	this.fetchSender(this.idSender);
  	},
};
</script>
