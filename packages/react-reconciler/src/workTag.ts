export type WorkTag =
	| typeof FunctionCompent
	| typeof HostCompent
	| typeof HostRoot
	| typeof HostText;

export const FunctionCompent = 0;
export const HostRoot = 3;
//HostCompent 就是div原生dom
export const HostCompent = 5;
export const HostText = 6;
