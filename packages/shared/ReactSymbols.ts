//当前环境是否支持symbol
const supportSymbol = typeof Symbol === 'function' && typeof Symbol.for;
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7;