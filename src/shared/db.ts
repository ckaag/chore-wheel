// db.ts
import Dexie, { type Table } from 'dexie';
import {type Chore} from './chore';

export class MySubClassedDexie extends Dexie {
  chores!: Table<Chore>; 

  constructor() {
    super('choreWheelChoreTestDb');
    this.version(1).stores({
    chores: '++id, name, created, nextExecutionLast, points, enabled',
    });
  }
}

export const db = new MySubClassedDexie();