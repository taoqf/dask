export interface Dask {
	[key: string]: string | number | boolean | Object | { [fun: string]: any[]; };
}

class Deferred<T> {
	promise: Promise<T>;
	resolve: (value?: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}

export async function get(dsk: Dask, result: string/* | string[]*/, funcs: { [fun: string]: Function; }): Promise<any> {
	const cache = {};
	return await _get(dsk, result, cache, funcs);
}

export default get;

async function _get(dsk: Dask, result: string/* | string[]*/, cache: { [key: string]: Deferred<any> }, funcs: { [fun: string]: Function; }): Promise<any> {
	if (!(result in dsk)) {
		return result;
	}
	const v = dsk[result];
	// console.log('dask-pending:', result);
	if (v == result) {
		// console.log('dask-resolved', result, '=', v);
		return v;
	}
	if (result in cache) {
		return cache[result].promise;
	}
	const deferred = new Deferred<any>();
	cache[result] = deferred;
	if (typeof v === 'object') {
		const keys = Object.keys(v);
		if (keys.length == 1) {
			const fun_name = keys[0];
			const fun = funcs[fun_name];
			if (typeof fun === 'function') {
				const args = (v[fun_name] || []) as any[];
				// console.log('dask-calling fun=', fun_name);
				const val = await fun.apply(null, await Promise.all(args.map((arg) => {
					return _get(dsk, arg, cache, funcs);
				})));
				// console.log('dask-resolved fun=', fun_name, result, '=', val);
				deferred.resolve(val);
				return val;
			}
		}
	} else {
		if (typeof v === 'string') {
			const d = dsk[v];
			if (d) {
				const val = await _get(dsk, v, cache, funcs);
				// console.log('dask-resolved', result, '=', val);
				deferred.resolve(val);
				return val;
			}
		}
	}
	// console.log('dask-resolved', result, '=', v);
	deferred.resolve(v);
	return v;
}
