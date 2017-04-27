import isObject from 'lodash-ts/isObject';
import isString from 'lodash-ts/isString';
import isFunction from 'lodash-ts/isFunction';

export interface Dask {
	[key: string]: string | number | boolean | Object | { [fun: string]: any[]; };
}

export async function get(dsk: Dask, result: string/* | string[]*/, funcs: { [fun: string]: Function; }) {
	const v = dsk[result];
	// console.log(`*********${result}**********`);
	// console.info(dsk);
	if (isObject(v)) {
		const keys = Object.keys(v);
		if (keys.length == 1) {
			const fun_name = keys[0];
			const fun = funcs[fun_name];
			if (isFunction(fun)) {
				const args = (v[fun_name] || []) as any[];
				return await fun.apply(null, await Promise.all(args.map((arg) => {
					return get(dsk, arg, funcs);
				})));
			}
		}
	} else {
		if (isString(v)) {
			const d = dsk[v as string];
			if (d) {
				return await get(dsk, v as string, funcs);
			}
		}
	}
	return await v;
}
