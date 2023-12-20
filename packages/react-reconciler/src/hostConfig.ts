export type Container = any;
export type Instance = Element;

export const createInstance = (...args: any) => {
	return {} as any;
};

export const createTextInstance = (...args: any) => {
	return {} as any;
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};
export const appendChildToContainer = appendInitialChild;
