// db.ts
import Dexie, { type Table } from 'dexie';
import type { Chore } from './chore';
import { addDays } from 'date-fns';

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

		this.version(3).stores({
			chores: '++id, name, created, nextExecutionLast, nextExecutionEarliest, points, enabled'
		}).upgrade((trans) => {
			return trans
				.table('chores')
				.toCollection()
				.modify((chore) => {
					chore.nextExecutionEarliest = addDays(chore.executionsInDescendingOrder[0] ?? addDays(new Date(), (-1) * chore.maxDaysOfInterval), chore.minDaysOfInterval);
				});
		});
	}
}

export const db = new MySubClassedDexie();
