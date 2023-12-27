/**
 * 描述宿主环境方法的文件
 */

export type Container = Element;
export type Instance = Element;

export const createInstance = (type: string, props?: any): Instance => {
	// TODO 处理props
	const element = document.createElement(type);
	return element;
};

export const createTextInstance = (context: string) => {
	return document.createTextNode(context);
};
/**parent.appendChild(child); */
export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};
export const appendChildToContainer = appendInitialChild;
