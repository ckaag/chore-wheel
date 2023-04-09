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
			.where('nextExecutionEarliest')
			.belowOrEqual(filterCutOffDate)
			.filter((chore: Chore) => !!chore.enabled)
			.reverse()
			.sortBy('points');
	});

	function updateFilter() {
		dispatch('filterToggled', {
			filterUrgent,
			filterCutOffDate: filterUrgent ? new Date() : new Date(8640000000000000)
		});
	}
</script>

<div class="btn-group btn-group-toggle mb-3 mt-3" data-toggle="buttons">
	<label class={filterUrgent ? 'btn btn-secondary active' : 'btn btn-secondary active'}>
		<input
			type="radio"
			name="options"
			id="option1"
			autocomplete="off"
			bind:group={filterUrgent}
			value={true}
			on:change={updateFilter}
		/> Nur Fällige anzeigen
	</label>
	<label class={!filterUrgent ? 'btn btn-secondary active' : 'btn btn-secondary active'}>
		<input
			type="radio"
			name="options"
			id="option2"
			autocomplete="off"
			bind:group={filterUrgent}
			value={false}
			on:change={updateFilter}
		/> Alle anzeigen
	</label>
</div>

<div class="row row-cols-1 row-cols-md-2 g-4 m-1">
	{#if $chores}
		{#each $chores as chore (chore.id)}
			<div class="col">
				<div
					class={chore.nextExecutionLast < new Date()
						? 'card text-white bg-danger'
						: 'card bg-light'}
				>
					<div class="card-header">{chore.name}</div>
					<div class="card-body">
						<p class="card-text">({chore.points}) {chore.description}</p>
						{#if chore.nextExecutionLast < new Date()}
							<p>Fällig seit: {chore.nextExecutionLast}</p>
						{/if}
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
