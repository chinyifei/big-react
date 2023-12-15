import { Action } from 'shared/ReactTypes';

export interface Update<state> {
	action: Action<state>;
}

export type UpdateQueue<state> = {
	shared: {
		pending: Update<state> | null;
	};
};

export const createUpdate = <state>(action: Action<state>): Update<state> => {
	return {
		action,
	};
};

export const createUpdateQueue = <Action>(): UpdateQueue<Action> => {
	return {
		shared: {
			pending: null,
		},
	} as UpdateQueue<Action>;
};

export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update;
};

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
