# big-react

## 从零实现react18

从零实现 React v18 的核心功能，特点如下：

- 👬 与 React 源码最接近的实现
- 🚶 按`Git Tag`划分迭代步骤，记录从 0 实现的每个功能

实现 useState 的 mount 时流程，包括如下功能：

- FunctionComponent 类型支持
- Hooks 架构 mount 时实现
- useState 实现

插入单节点的 mount 流程（可以在浏览器环境渲染 DOM），包括如下功能：

- 浏览器环境 DOM 的插入
- HostText 类型支持

插入单节点的 render 阶段 mount 流程，包括如下功能：

- JSX 转换
- Fiber 架构
- 插入单节点的 reconcile 流程
- HostComponent 类型支持
- HostRoot 类型支持
