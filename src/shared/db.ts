// db.ts
import Dexie, { type Table } from 'dexie';
import type { Chore } from './chore';

export class MySubClassedDexie extends Dexie {
	chores!: Table<Chore>;

	constructor() {
		super('choreWheelChoreTestDb');
		this.version(1).stores({
			chores: '++id, name, created, nextExecutionLast, points, enabled'
		});

		this.version(2).upgrade((trans) => {
			return trans
				.table('chores')
				.toCollection()
				.modify((chore) => {
					chore.nextExecutionLast = new Date();
				});
		});
	}
}

export const db = new MySubClassedDexie();
