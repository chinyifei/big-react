export type Type = any;
export type Key = any;
// export type Ref<T> = { current: T };
export type Ref = any;
export type ElementType = any;
export type Props = any;

export interface ReactElement {
	$$typeof: symbol | number;
	type: ElementType;
	key: Key;
	ref: Ref;
	props: Props;
	__mark: string;
}
