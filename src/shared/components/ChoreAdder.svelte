<script lang="ts">
	import type { Chore } from '../chore';
	import { db } from '../db';

	let status = '';

	let name = '';
	let description = '';
	let points = 5.0;
	let minDaysOfInterval = 14.0;
	let maxDaysOfInterval = 21.0;

	async function importDB() {
		alert('TODO: implement');
	}

	async function addNewChore() {
		try {
			const id = await db.chores.add({
				name,
				description,
				points,
				minDaysOfInterval,
				maxDaysOfInterval,
				executionsInDescendingOrder: [],
				created: new Date(),
				enabled: true,
				nextExecutionLast: new Date()
			} as Chore);

			// Reset form:
			name = '';
			description = '';
		} catch (error) {
			alert(`Failed to add ${name}: ${error}`);
			console.log(error);
		}
	}

	async function exportAllAndDownload() {
		const arr = await db.chores.toArray();
		const json = JSON.stringify(arr);
		const dataUri = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
		const link = document.createElement('a');
		link.download = name;
		link.href = dataUri;
		link.download = `chore-export-${Date.now()}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<div style="border: 2px solid black;" class="p-2 m-1">
	<button class="btn btn-secondary" on:click={exportAllAndDownload}>Exportieren</button>
	<button class="btn btn-secondary" on:click={importDB}>Importieren</button>

	<p>{status}</p>
	<fieldset>
		<legend>Neuen Chore hinzufügen</legend>
		<label class="form-label">
			Name:
			<input class="form-control" type="text" bind:value={name} required />
		</label>
		<br />
		<label class="form-label">
			Beschreibung:
			<input class="form-control" type="text" bind:value={description} />
		</label>
		<br />
		<label class="form-label">
			Punkte:
			<input class="form-control" type="number" min="0.5" step="0.5" bind:value={points} />
		</label>
		<br />
		<label class="form-label">
			Tage zwischen Ausführung mindestens:
			<input class="form-control" type="number" min="1" step="1" bind:value={minDaysOfInterval} />
		</label>
		<br />
		<label class="form-label">
			Tage zwischen Ausführung höchstens:
			<input class="form-control" type="number" min="1" step="1" bind:value={maxDaysOfInterval} />
		</label>
		<br />
		<button class="btn btn-primary mt-2 mb-2" disabled={!!name} on:click={addNewChore}
			>Chore hinzufügen</button
		>
	</fieldset>
</div>
