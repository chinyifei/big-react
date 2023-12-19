import { Props, Key, ReactElementType } from 'shared/ReactTypes';
import { FunctionCompent, HostCompent, WorkTag } from './workTag';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	/** 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，
	 * 对于HostComponent，指DOM节点tagName */
	type: any;
	/**Fiber对应组件的类型 Function/Class/Host... */
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
	subtreeFlags: Flags;
	updateQueue: unknown;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 作为静态数据结构的属性
		this.tag = tag;
		// this.pendingProps = pendingProps;
		this.key = key;
		this.stateNode = null;
		this.type = null;
		// // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
		// this.elementType = null;
		/**构成树状结构 */
		//指向父fiberbode
		this.return = null;
		this.sibling = null;
		this.child = null;
		//<ul>li *3</ul>
		this.index = 0;

		/**作为工作单元 */
		// 保存本次更新造成的状态改变相关信息
		this.pendingProps = pendingProps; //开始工作之前的props
		this.memorizedProps = null; //工作完成之后的props
		this.memorizedState = null;
		this.alternate = null;
		this.updateQueue = null;
		//副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	/**指向我们更新完成之后的hostRootFiber */
	finishedWork: FiberNode | null;
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
		wip.subtreeFlags = NoFlags;
	}
	wip.type = current.type;
	//updateQueue的数据结构设计就是为了现在两颗fiber树能公用一个updateQueue
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memorizedProps = current.memorizedProps;
	wip.memorizedState = current.memorizedState;
	return wip;
};

export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { props, key, type } = element;
	let fiberTag: WorkTag = FunctionCompent;
	if (type === 'string') {
		//<div></div> type:div
		fiberTag = HostCompent;
	} else if (type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
