import { Props, Key } from 'shared/ReactTypes';
import { WorkTag } from './workTag';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: FiberNode | null;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	memorizeState: Props | null;
	alternate: FiberNode | null;
	flags: Flags;
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
		this.memorizeState = null; //工作完成之后的props
		this.alternate = null;
		//副作用
		this.flags = NoFlags;
	}
}
