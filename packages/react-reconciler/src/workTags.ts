export type WorkTag =
	| typeof FunctionComponent
	| typeof HostComponent
	| typeof HostRoot
	| typeof HostText;

export const FunctionComponent = 0;
export const HostRoot = 3;
//HostComponent 就是div原生dom
export const HostComponent = 5;
export const HostText = 6;
