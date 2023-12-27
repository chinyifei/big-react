import { Props, Key, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	/** 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，
	 * 对于HostComponent，指DOM节点tagName */
	type: any;
	/**Fiber对应组件的类型 Function/Class/Host... */
	tag: WorkTag;
	key: Key;
	/**Fiber对应的真实DOM节点 */
	stateNode: any;
	/**父FiberNode */
	return: FiberNode | null;
	/**兄弟FiberNode */
	sibling: FiberNode | null;
	/**子FiberNode */
	child: FiberNode | null;
	/**表示同级FiberNode第几个li ul>li*3 */
	index: number;
	/**开始工作之前的props */
	pendingProps: Props;
	/**工作完成之后的props */
	memoizedProps: Props | null;
	/**保存上一次工作的state(暂定jsx 或者是返回jsx的函数) */
	memoizedState: any;
	/**指向该FiberNode在另一次更新时对应的FiberNode  */
	alternate: FiberNode | null;
	/**副作用标记 例如placement,deletion,update */
	flags: Flags;
	/**子树中的副作用 */
	subtreeFlags: Flags;
	/**保存UpdateQueue的数据结构
 * {
		shared: {
			pending: null,
		},
	}
*/
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
		/** 保存本次更新造成的状态改变相关信息*/
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.alternate = null;
		this.updateQueue = null;
		//副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	/**保存宿主环境挂在的节点 */
	container: Container;
	/**指向我们的hostRootFiber */
	current: FiberNode;
	/**指向我们更新完成之后的hostRootFiber */
	finishedWork: FiberNode | null;
	constructor(container: any, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}
/**获取当前FiberNode与之对应的另外一FiberNode(alternate) */
export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
) => {
	let wip = current.alternate;
	/**是否是首屏渲染 */
	if (wip === null) {
		//mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		//update
		wip.pendingProps = current.pendingProps;
		//清楚上一次遗留下来的副作用
		wip.flags = NoFlags;
		wip.subtreeFlags = NoFlags;
	}
	wip.type = current.type;
	//updateQueue的数据结构设计就是为了现在两颗fiber树能公用一个updateQueue
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;
	return wip;
};
/**根据ReactElementType创建FiberNode */
export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { props, key, type } = element;
	let fiberTag: WorkTag = FunctionComponent;
	if (typeof type === 'string') {
		//<div></div> type:div
		fiberTag = HostComponent;
	} else if (type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
