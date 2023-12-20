import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostCompent, HostRoot, HostText } from './workTag';
let nextEffect: FiberNode | null = null;
export function commitMutationEffect(finishedWork: FiberNode) {
	nextEffect = finishedWork;
	while (nextEffect !== null) {
		//向下遍历
		const child: FiberNode | null = nextEffect.child;
		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			/**不包含subtreeFlags,有可能包含Flags,
			 * 或者找到底了
			 */
			//向上遍历 DFS
			up: while (nextEffect !== null) {
				commitMutationEffectOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
}

function commitMutationEffectOnFiber(finishedWork: FiberNode) {
	const flags = finishedWork.flags;
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		//finishedWork的flags中清除Placement
		// finishedWork.flags = (finishedWork.flags & ~Placement)
		finishedWork.flags &= ~Placement;
		// TODO flags Update
		// flags ChildDeletion
	}
}

function commitPlacement(finishedWork: FiberNode) {
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}
	//parent DOM
	const hostParent = getHostParent(finishedWork);
	// 找到finishedWork DOM  ---> append parent DOM
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
}

/**获取宿主环境的parent节点 */
function getHostParent(fiber: FiberNode): Container | null {
	let parent = fiber.return;
	while (parent) {
		if (parent.tag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		if (parent.tag === HostCompent) {
			return parent.stateNode as Container;
		}
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('没有找到host parent节点');
	}
	return null;
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// fiber host
	if (finishedWork.tag === HostCompent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;
		while (sibling) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
