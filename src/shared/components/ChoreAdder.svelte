
<script lang="ts">

import addDays from 'date-fns/addDays';
	import type { Chore } from "../chore";
	import { db } from "../db";


export let defaultAge = 21;
  
  let status = "";

  let name = "";
  let description = "";
  let points = 5.0;
  let minDaysOfInterval = 14.0;
  let maxDaysOfInterval = 21.0;


async function exportDB() {
    alert('TODO: implement');
}
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
  nextExecutionLast: addDays(new Date(), maxDaysOfInterval)
} as Chore);

// Reset form:
name = "";
description = "";
} catch (error) {
alert(`Failed to add ${name}: ${error}`);
console.log(error);
}
}

    </script>


<div style="border: 2px solid black;">

    <button on:click={exportDB}>Export Database</button>
    <button on:click={importDB}>Import Database</button>

    <p>{status}</p>
    <fieldset>
      <legend>Neuen Chore hinzufügen</legend>
      <label>
        Name:
        <input
            type="text"
            bind:value={name} />
      </label>
      <br/>
      <label>
        Beschreibung:
        <input
            type="text"
            bind:value={description} />
      </label>
      <br/>
      <label>
        Punkte:
        <input
          type="number"
          min="0.5"
          step="0.5"
          bind:value={points} />
      </label>
      <br/>
      <label>
        Tage zwischen Ausführung mindestens:
        <input
          type="number"
          min="1"
          step="1"
          bind:value={minDaysOfInterval} />
      </label>
      <br/>
      <label>
        Tage zwischen Ausführung höchstens:
        <input
          type="number"
          min="1"
          step="1"
          bind:value={maxDaysOfInterval} />
      </label>
      <br />
      <button on:click={addNewChore}>Chore hinzufügen</button>
    </fieldset>
  </div>