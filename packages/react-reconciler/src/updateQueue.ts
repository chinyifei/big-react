import { Action } from 'shared/ReactTypes';

export interface Update<state> {
	action: Action<state>;
}

export type UpdateQueue<state> = {
	shared: {
		pending: Update<state> | null;
	};
};
//创建数据结构update
export const createUpdate = <state>(action: Action<state>): Update<state> => {
	return {
		action,
	};
};
//保存update的数据结构
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	return {
		shared: {
			pending: null,
		},
	} as UpdateQueue<State>;
};
//Update插入UpdateQueue中
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};
//消费update
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState,
	};
	if (pendingUpdate !== null) {
		// baseState:1  update :(x)=>3x => memoizedState:3
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
		} else {
			// baseState:1 updateState:2 => memoizedState:2
			result.memoizedState = action;
		}
	}
	return result;
};
