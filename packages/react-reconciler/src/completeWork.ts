import {
	appendInitialChild,
	createInstance,
	createTextInstance,
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

/**递归中归阶段
 * 1.对于Host类型fiberNode：构建离屏DOM树
 *  我们可以构建好「离屏DOM树」后，对div执行1次Placement操作
		生成子节点以及标记flags副作用的过程
    2.标记Update flag（TODO）
 */
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		/**构建「离屏DOM树」 */
		case HostComponent:
			if (current !== null && wip.stateNode) {
				//update 对于HostComponent，他的 wip.stateNode --> 保存的就是dom节点
			} else {
				/**
				 * 1.构建DOM
				 * 2.将构建DOM插入DOM树
				 */
				const instance = createInstance(wip.type, newProps);
				/**将wip「离屏DOM树」挂在到instance上 */
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
				//update
			} else {
				const instance = createTextInstance(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.warn('completeWork未实现的类型');
			}
			return null;
	}
};
/**在parent节点下插入wip节点 */
function appendAllChildren(parent: Element, wip: FiberNode) {
	let node = wip.child;
	/**wip本身有可能不是DOM节点
	 * 对wip节点进行递归,寻找HostComponent或者HostText类型的节点
	 */
	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			//首先往下找
			node.child.return = node;
			node = node.child;
			continue;
		}
		//回到原点
		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			//回到原点
			if (node.return === null || node.return === wip) {
				return;
			}
			//在往上找
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}
/**将当前节点的子节点以及子节点的兄弟节点中的flags副作用冒泡到
 * 当前节点的subtreeFlags上,这样我们一直冒泡到根节点.所以根据
 * subtreeFlags我们就可以知道当前子树里面是否包含副作用
 * tips:因为completeWork归的阶段,wip对应的节点一定是最靠上的节点
 */
function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}
	wip.subtreeFlags |= subtreeFlags;
}
