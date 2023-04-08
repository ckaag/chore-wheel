<script>
	import ChoreAdder from '../shared/components/ChoreAdder.svelte';
	import ChoreList from '../shared/components/ChoreList.svelte';

	let filterDate = new Date();
</script>

<div class="m-2">
	<h1>Chore Wheel</h1>

	<ChoreAdder />

	<h2>Chores</h2>
	<ChoreList
		on:filterToggled={(e) => {
			filterDate = e.detail.filterCutOffDate;
		}}
		bind:filterCutOffDate={filterDate}
	/>
</div>
