//递归中递阶段

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostCompent, HostRoot, HostText } from './workTag';
import { mountChildFibers, reconcileChildFibers } from './childrenFibers';

/**
 * beginWork中标记的都是与结构相关的flags:placment/childrenDeletion
 * 不包含属性变化的flags:update
 *
 */
export const beginWork = (wip: FiberNode) => {
	// 比较,然后返回子fiberNode
	switch (wip.tag) {
		case HostCompent:
			return updateHostRoot(wip);
		case HostRoot:
			return updateHostComponent(wip);
		/**HostText没有子节点 返回null,归 */
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
	}
};

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memorizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	//执行完清楚副作用
	updateQueue.shared.pending = null;
	const { memorizedState } = processUpdateQueue(baseState, pending);
	wip.memorizedState = memorizedState;

	/**通过对比子 current fiberNode与子 reactElement，生成子对应wip fiberNode */
	//子reactelement
	const nextChildren = wip.memorizedState;

	// 子current fiberNode =  wip.alternate?.child;
	reconcileChildFibers(nextChildren, wip);
	return wip.child;
}

/**
 * 1.创建子fiberNode
 * <div><span>1234</span></div>
 * span就相当于props上的children
 *  */
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	/**
	 * 通过对比子 current fiberNode与子 reactElement，生成子对应wip fiberNode
	 */
	const current = wip.alternate;
	if (current !== null) {
		//update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		//mount
		wip.child = mountChildFibers(wip, null, children);
	}
	// reconcileChildFibers(wip, current?.child, children);
	return wip.child;
}
