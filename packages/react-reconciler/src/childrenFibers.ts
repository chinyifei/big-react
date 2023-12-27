import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { HostText } from './workTags';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { Placement } from './fiberFlags';

/**
 * 设计成闭包形式,根据shouldTrackEffects来返回不同的reconcileChildFibers实现
 *
 * @param shouldTrackEffects  是否追踪副作用
 * @param wip workInProgress
 * @returns  FiberNode | null
 */
function childReconciler(shouldTrackEffects: boolean, wip?: FiberNode) {
	/**创建单节点 */
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		//根据reactElement创建fiberNode(workInProgress对应的fiberNode)
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}
	/**创建文本节点 */
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	/**插入单一的节点 */
	function placeSingleChild(fiber: FiberNode) {
		//fiber.alternate === null 首屏渲染
		//是否应该标记副作用
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}
	/**
	 * 通过对比子 current fiberNode与子 reactElement，生成子对应wip fiberNode
	 */
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		//判断当前fiber类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', newChild);
					}
					break;
			}
		}
		//TODO 多节点情况 ul> li*3
		//
		//HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}
		if (__DEV__) {
			console.warn('未实现的reconcile类型', newChild);
		}
		return null;
	};
}
/**追踪副作用 */
export const reconcileChildFibers = childReconciler(true);
/**不追踪副作用 */
export const mountChildFibers = childReconciler(false);
