import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTag';

let workInprogress: FiberNode | null = null;

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
	//init
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (error) {
			workInprogress = null;
			console.warn('workLoop发生错误:', error);
		}
	} while (true);
}

function workLoop() {
	while (workInprogress !== null) {
		PerformUnitOfWork(workInprogress);
	}
}

const PerformUnitOfWork = (fiber: FiberNode) => {
	const next = beginWork();
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
		completeWork();
		if (node.sibling !== null) {
			workInprogress = node.sibling;
			//归
			return;
		}
		node = node.return;
	} while (node !== null);
};
