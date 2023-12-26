/**触发更新的机制 */
import { Action } from 'shared/ReactTypes';

export interface Update<state> {
	action: Action<state>;
}

export type UpdateQueue<state> = {
	shared: {
		pending: Update<state> | null;
	};
};
/**创建数据结构update
 * {
		action,
	} */
export const createUpdate = <state>(action: Action<state>): Update<state> => {
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
