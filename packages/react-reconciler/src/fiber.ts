import { Props, Key } from 'shared/ReactTypes';
import { WorkTag } from './workTag';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	memorizedProps: Props | null;
	memorizedState: any;
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: unknown;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		// this.pendingProps = pendingProps;
		this.key = key;
		this.stateNode = null;
		this.type = null;
		/**构成树状结构 */
		//指向父fiberbode
		this.return = null;
		this.sibling = null;
		this.child = null;
		//<ul>li *3</ul>
		this.index = 0;

		/**作为工作单元 */
		this.pendingProps = pendingProps; //开始工作之前的props
		this.memorizedProps = null; //工作完成之后的props
		this.memorizedState = null;
		this.alternate = null;
		this.updateQueue = null;
		//副作用
		this.flags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null; //指向我们更新完成之后的hostRootFiber
	constructor(container: any, hostFiber: FiberNode) {
		this.container = container;
		this.current = hostFiber;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
) => {
	let wip = current.alternate;

	if (wip === null) {
		//mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		//update
		wip.pendingProps = current.pendingProps;
		//清楚上一次的副作用
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	//updateQueue的数据结构设计就是为了现在两颗fiber树能公用一个updateQueue
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memorizedProps = current.memorizedProps;
	wip.memorizedState = current.memorizedState;
	return wip;
};
