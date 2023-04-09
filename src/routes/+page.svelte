<script>
	import ChoreAdder from '../shared/components/ChoreAdder.svelte';
	import ChoreList from '../shared/components/ChoreList.svelte';

	let filterDate = new Date();
	let showAdder = false;
</script>

<div class="m-2">
	<h1>
		Chore Wheel <button
			type="button"
			class="btn btn-light"
			on:click={() => (showAdder = !showAdder)}>➕</button
		>
	</h1>
	{#if showAdder}
		<ChoreAdder />
	{/if}

	<ChoreList
		on:filterToggled={(e) => {
			filterDate = e.detail.filterCutOffDate;
		}}
		bind:filterCutOffDate={filterDate}
	/>
</div>
