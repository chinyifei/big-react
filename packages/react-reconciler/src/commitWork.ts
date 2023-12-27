import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';
let nextEffect: FiberNode | null = null;
/**找到具体副作用的fiberNode */
export function commitMutationEffects(finishedWork: FiberNode) {
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
			/**不包含subtreeFlags,有可能包含Flags,执行副作用commitMutationEffectOnFiber
			 * 或者找到底了,向上遍历
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
/**处理拥有flags节点的副作用 */
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
/**执行Placement副作用 */
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
		if (parent.tag === HostComponent) {
			return parent.stateNode as Container;
		}
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('没有找到host parent节点');
	}
	return null;
}
/** 将Placement对应的node插入到宿主环境*/
function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// fiber host
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
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
