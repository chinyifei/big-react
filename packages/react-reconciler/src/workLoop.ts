import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let workInprogress: FiberNode | null = null;
/**根据fiberRootNode生成hostRootFiber,接着生成hostRootFiber对应的workInprogress */
function prepareFreshStack(root: FiberRootNode) {
	workInprogress = createWorkInProgress(root.current, {});
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
	commitRoot(root);
}
/**commit阶段 */
function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		//commit阶段不存在task
		return;
	}
	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}
	//重置
	root.finishedWork = null;
	//判断root本身的Flags和subtreeFlags
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
	/**判断是否存在三个子阶段需要执行的操作 */
	if (subtreeHasEffect || rootHasEffect) {
		//   beforeMutation阶段
		// mutation阶段 Placement
		commitMutationEffects(finishedWork);
		/**在layout开始之前,mutation结束之后,切换current fiber树
		 *root.current指向当前fiber-->current
     finishedWork指向workInProgress --> wip fiber树
		 */
		root.current = finishedWork;
		// layout阶段
	} else {
		root.current = finishedWork;
	}
}

/**整个更新流程就是一个递归的过程,递:beginWork归:completeWork */
function workLoop() {
	while (workInprogress !== null) {
		PerformUnitOfWork(workInprogress);
	}
}

const PerformUnitOfWork = (fiber: FiberNode) => {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;
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
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInprogress = sibling;
			//归
			return;
		}
		node = node.return;
		workInprogress = node;
	} while (node !== null);
};
