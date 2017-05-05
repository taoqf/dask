import isObject from 'lodash-ts/isObject';
import isString from 'lodash-ts/isString';
import isFunction from 'lodash-ts/isFunction';

export interface Dask {
	[key: string]: string | number | boolean | Object | { [fun: string]: any[]; };
}

class Deferred<T> extends Promise<T> {
	resolve: (value?: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
	fullfiled: boolean;
	constructor() {
		let rs: (value?: T | PromiseLike<T>) => void = null as any;
		let rj: (reason?: any) => void = null as any;
		super((resolve, reject) => {
			rs = resolve;
			rj = reject;
		});
		this.resolve = rs;
		this.reject = rj;
		this.fullfiled = false;
	}
}

export async function get(dsk: Dask, result: string/* | string[]*/, funcs: { [fun: string]: Function; }): Promise<any> {
	const cache = {};
	return await _get(dsk, result, cache, funcs);
}

export default get;

async function _get(dsk: Dask, result: string/* | string[]*/, cache: { [key: string]: Deferred<any> }, funcs: { [fun: string]: Function; }): Promise<any> {
	const v = dsk[result];
	if (result in cache) {
		return await cache[result];
	}
	const deferred = new Deferred<any>();
	cache[result] = deferred;
	if (isObject(v)) {
		const keys = Object.keys(v);
		if (keys.length == 1) {
			const fun_name = keys[0];
			const fun = funcs[fun_name];
			if (isFunction(fun)) {
				const args = (v[fun_name] || []) as any[];
				const val = await fun.apply(null, await Promise.all(args.map((arg) => {
					return _get(dsk, arg, cache, funcs);
				})));
				deferred.resolve(val);
				return val;
			}
		}
	} else {
		if (isString(v)) {
			const d = dsk[v as string];
			if (d) {
				const val = await _get(dsk, v as string, cache, funcs);
				deferred.resolve(val);
				return val;
			}
		}
	}
	deferred.resolve(v);
	return Promise.resolve(v);
}
