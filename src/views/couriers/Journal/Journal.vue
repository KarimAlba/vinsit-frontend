<template>
  <div>
    <FilterJournal/>
    <BlockJournal/>
  </div>
</template>

<script>
import BlockJournal from './BlockJournal.vue';
import FilterJournal from './FilterJournal.vue';

export default {
		data() {
			return {
			};
		},
		components: {
			BlockJournal,
			FilterJournal,
		},
		watch: {
		},
		computed: {
		},
		methods: {
		},
		mounted() {
		},
	
};
</script>

<style lang="scss" scoped></style>
