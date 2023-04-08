<script lang="ts">
	import type { Chore } from '../chore';
	import { liveQuery } from 'dexie';
	import { db } from '../db';
    import addDays from 'date-fns/addDays';

	async function executeChore(chore: Chore) {
        const now = new Date();
        await db.chores.update(chore.id, {nextExecutionLast: addDays(now, maxDaysOfInterval), executionsInDescendingOrder: [now, ...chore.executionsInDescendingOrder]});
	}
	async function disableChore(chore: Chore) {
		if (confirm('Diesen Eintrag ' + chore.name + ' wirklich permanent disablen?')) {
            await db.chores.update(chore.id, {enabled: false});
		}
	}

	let chores = liveQuery(() =>
		db.chores
			.orderBy('nextExecutionLast').reverse()
			.filter((chore: Chore) => !!chore.enabled)
			.toArray()
	);
</script>

<ul>
	{#if $chores}
		{#each $chores as chore (chore.id)}
			<li>
				{chore.name}, {chore.description}, {chore.points}

				<button on:click={() => disableChore(chore)}>Ausschalten</button>
				<button on:click={() => executeChore(chore)}>Erfüllt</button>
			</li>
		{/each}
	{/if}
</ul>
