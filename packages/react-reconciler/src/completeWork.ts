import {
	appendInitialChild,
	createInstance,
	createTextInstance,
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostCompent, HostRoot, HostText } from './workTag';
import { NoFlags } from './fiberFlags';

//递归中归阶段
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostCompent:
			if (current !== null && wip.stateNode) {
				//update wip.stateNode -->dom节点
			} else {
				/**
				 * 构建DOM
				 * 将构建DOM插入DOM树
				 */
				const instance = createInstance(wip.type, newProps);
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

function appendAllChildren(parent: Element, wip: FiberNode) {
	let node = wip.child;

	while (node !== null) {
		if (node.tag === HostCompent || node.tag === HostText) {
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			//叶子节点或者是原点
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

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
