import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTag';

let workInprogress: FiberNode | null = null;
/**根据fiberRootNode生成hostRootFiber,接着生成hostRootFiber对应的workInprogress */
function prepareFreshStack(fiber: FiberRootNode) {
	workInprogress = createWorkInProgress(fiber.current, {});
}

//连接rendeRoot和updateQueue
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	//fiber root node
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}
/**从当前更新的fiber一直遍历到fiberRootNode */
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = fiber.return;
	while (parent !== null) {
		node = parent;
		parent = parent.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	//init初始化
	prepareFreshStack(root);
	/**指行更新流程 */
	do {
		try {
			workLoop();
			break;
		} catch (error) {
			workInprogress = null;
			if (__DEV__) {
				console.warn('workLoop发生错误:', error);
			}
		}
	} while (true);
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	//根据wip以及树中的Flags执行具体的DOM操作
	// commitRoot(root);
}
/**整个更新流程就是一个递归的过程,递:beginWork归:completeWork */
function workLoop() {
	while (workInprogress !== null) {
		PerformUnitOfWork(workInprogress);
	}
}

const PerformUnitOfWork = (fiber: FiberNode) => {
	const next = beginWork(fiber);
	fiber.memorizedState = fiber.pendingProps;
	if (next === null) {
		/**如果没有子节点,遍历兄弟节点 */
		completeUnitOfWork(fiber);
	} else {
		workInprogress = next as any;
	}
};

const completeUnitOfWork = (fiber: FiberNode) => {
	let node: FiberNode | null = fiber;
	do {
		completeWork(fiber);
		if (node.sibling !== null) {
			workInprogress = node.sibling;
			//归
			return;
		}
		node = node.return;
	} while (node !== null);
};
