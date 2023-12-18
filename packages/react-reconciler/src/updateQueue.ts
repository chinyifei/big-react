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
): { memorizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState,
	};
	if (pendingUpdate !== null) {
		// baseState:1  update :(x)=>3x => memorizedState:3
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memorizedState = action(baseState);
		} else {
			// baseState:1 updateState:2 => memorizedState:2
			result.memorizedState = action;
		}
	}
	return result;
};
