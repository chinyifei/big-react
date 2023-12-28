//递归中递阶段

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText,
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childrenFibers';
import { renderWithHooks } from './fiberHooks';

/**
 * 通过对比子React element 与 子FiberNode 比较,生成返回子对应的wip的FiberNode
 * tips:beginWork中标记的都是与结构相关的flags:placment(插入和移动)/childrenDeletion
 * 不包含属性变化的flags:update
 */
export const beginWork = (wip: FiberNode) => {
	// 比较,然后返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		/**HostText没有子节点,没有beginWork工作流程 返回null,归 */
		case FunctionComponent:
			return updateFunctionComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
	return null;
};
/**1.计算状态的最新值,
 * 2.然后创建子fiberNode */
function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	//执行完清楚副作用
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	//获取子reactElement
	const nextChildren = wip.memoizedState;

	// 子current fiberNode =  wip.alternate?.child;
	// reconcileChildFibers(nextChildren, wip);
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/**
 * 1.创建子fiberNode(HostComponent无法触发更新)
 * <div><span>1234</span></div>
 * span就相当于props上的children
 *  */
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip);
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/**
 * 通过对比子 current fiberNode与子 reactElement，生成子对应wip fiberNode
 */
function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	// current.child就是子对应的 current fiberNode
	const current = wip.alternate; //父节点的currentNode
	if (current !== null) {
		//update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		//mount
		/**对于首屏渲染 ,整颗fiber树只有一个节点他同时存在current和workInProgress
		 * 也就是hostRootFiber,因为在初始化时候我们执行了
     * /**
    * 初始化,使全局指针wip指向第一个FiberNode,
    * 根据fiberRootNode生成hostRootFiber,接着生成hostRootFiber对应的workInprogress 
    * function prepareFreshStack(root: FiberRootNode) {
        //FiberRootNode不能作为workInprogress,使用createWorkInProgress,生成FiberRootNode的workInProgress
        workInprogress = createWorkInProgress(root.current, {});
      }
		*/
		/**所以通过这个特性,就会走update的逻辑,就会插入一个placement的flags,最后我们就会执行一次DOM插入操作
		 * (就会将构建好的离屏DOM树插入到页面中)
		 */
		wip.child = mountChildFibers(wip, null, children);
	}
	// reconcileChildFibers(wip, current?.child, children);
	// return wip.child;
}
