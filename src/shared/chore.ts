export interface Chore {
    id?: number;
    enabled: true;
	created: Date;
	name: string;
	description: string;
	points: number;
	minDaysOfInterval: number;
	maxDaysOfInterval: number;
	executionsInDescendingOrder: Date[];
	nextExecutionLast: Date;
	nextExecutionEarliest: Date;
}
