import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInprogress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberNode) {
	workInprogress = fiber;
}

function renderRoot(root: FiberNode) {
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
	fiber.memorizeState = fiber.pendingProps;
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
