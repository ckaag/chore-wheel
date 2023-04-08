<script lang="ts">
	import type { Chore } from '../chore';
	import { liveQuery } from 'dexie';
	import { db } from '../db';
	import addDays from 'date-fns/addDays';
	import { createEventDispatcher } from 'svelte';

	let filterUrgent = true;

	export let filterCutOffDate = new Date();

	const dispatch = createEventDispatcher();

	async function executeChore(chore: Chore) {
		if (confirm(chore.name + ' erledigt?')) {
			const now = new Date();
			await db.chores.update(chore.id, {
				nextExecutionLast: addDays(now, chore.maxDaysOfInterval),
				executionsInDescendingOrder: [now, ...chore.executionsInDescendingOrder]
			});
			updateFilter();
		}
	}
	async function disableChore(chore: Chore) {
		if (confirm('Diesen Eintrag ' + chore.name + ' wirklich permanent disablen?')) {
			await db.chores.update(chore.id, { enabled: false });
			updateFilter();
		}
	}

	$: chores = liveQuery(async () => {
		return await db.chores
			.where('nextExecutionLast')
			.belowOrEqual(filterCutOffDate)
			.filter((chore: Chore) => !!chore.enabled)
			.reverse()
			.sortBy('nextExecutionLast');
	});

	function updateFilter() {
		dispatch('filterToggled', {
			filterUrgent,
			filterCutOffDate: filterUrgent ? new Date() : new Date(8640000000000000)
		});
	}
</script>

<label class="btn btn-info mb-3 mt-3">
	<input
		type="checkbox"
		class="btn-check"
		autocomplete="off"
		bind:checked={filterUrgent}
		on:change={updateFilter}
	/>
	Nur fällige anzeigen
</label>

<div class="row row-cols-1 row-cols-md-2 g-4 m-1">
	{#if $chores}
		{#each $chores as chore (chore.id)}
			<div class="col">
				<div class="card">
					<div class="card-body">
						<h5 class="card-title">{chore.name}</h5>
						<p class="card-text">({chore.points}) {chore.description}</p>
						<button type="button" class="btn btn-light" on:click={() => disableChore(chore)}
							>Ausschalten</button
						>
						<button type="button" class="btn btn-success" on:click={() => executeChore(chore)}
							>Als erfüllt markieren</button
						>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
