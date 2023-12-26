export type WorkTag =
	| typeof FunctionComponent
	| typeof HostComponent
	| typeof HostRoot
	| typeof HostText;

export const FunctionComponent = 0;
/**我们挂载的根节点，ReactDOM.render(<App />) */
export const HostRoot = 3;
//HostComponent 就是div原生dom
export const HostComponent = 5;
/**<div>123</div>中的123文本 */
export const HostText = 6;
