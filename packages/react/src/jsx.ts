import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Key,
	Ref,
	Props,
	ReactElement,
	ElementType,
} from 'shared/ReactTypes';
const ReactElement = (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElement => {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'chin',
	};
	return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	for (key in config) {
		const val = config[key];
		if (val !== undefined) {
			if (val === 'key') {
				key = '' + val;
			}
			continue;
		}
		if (val !== undefined) {
			if (val === 'ref') {
				ref = val;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, key)) {
			props[key] = val;
		}
		const maybeChildrenLength = maybeChildren.length;
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}
	return ReactElement(type, key, ref, props);
};

export const jsxDEV = jsx;
