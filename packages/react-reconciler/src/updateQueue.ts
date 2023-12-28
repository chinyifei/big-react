/**触发更新的机制 */
import { Action } from 'shared/ReactTypes';
import { Dispatch } from 'react/src/currentDispatcher';
export interface Update<State> {
	action: Action<State>;
}

export type UpdateQueue<State> = {
	shared: {
		pending: Update<State> | null;
	};
	dispatch: Dispatch<State> | null;
};
/**创建数据结构update
 * {
		action,
	} */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action,
	};
};
/**创建UpdateQueue的数据结构
 * {
		shared: {
			pending: null,
		},
	}
*/
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	return {
		shared: {
			pending: null,
		},
		dispatch: null,
	} as UpdateQueue<State>;
};
/**Update插入UpdateQueue中
 * updateQueue.shared.pending = update
 */
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};
/**消费update */
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
