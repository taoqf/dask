# dask
Task scheduling in JavaScript
# install
```bash
npm install dask --save
```
# example
1.
```javascript
import { get } from 'dask';

function add(x, y) {
	console.log('add');
	return x + y;
}

async function test() {
	const dsk = {
		x: 1,
		y: 2,
		z: {
			add: ['x', 'y']
		}
	};
	const funcs = { add };
	const z = await get(dsk, 'z', funcs);
	console.log('z:', z);
}

test();
```
2.
```javascript
import * as dask from 'dask';

function add(x, y) {
	console.log('add promise');
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(x + y);
		}, 100);
	});
}

async function test() {
	const dsk = {
		x: 1,
		y: 2,
		z: {
			add: ['x', 'y']
		}
	};
	const funcs = { add };
	const z = await dask.get(dsk, 'z', funcs);
	console.log('promise z:', z);
}

test();
```
3.
```javascript
import * as dask from 'dask';

const x = 1;
function add(y) {
	console.log('add const');
	return x + y;
}

async function test() {
	const dsk = {
		y: 2,
		z: {
			add: ['y']
		}
	};
	const funcs = { add };
	const z = await dask.get(dsk, 'z', funcs);
	console.log('add const z:', z);
}

test();
```
4.
```javascript
import * as dask from 'dask';

function inc(x) {
	console.log('promise inc', x);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(++x);
		}, 100);
	});
}

function add(x, y) {
	console.log('promise add', x, y);
	return x + y;
}

function xx() {
	return 1;
}

function xxx() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(1);
		}, 3000);
	});
}

async function test() {
	const dsk = {
		x1: {
			xx: []
		},
		x2: {
			xxx: []
		},
		x3: {
			add: ['x2', 'y']
		},
		y: 2,
		z: {
			add: ['x1', 'x3']
		},
		u: 'z',
		v: {
			inc: ['u']
		},
		w: {
			add: ['v', 'z']
		}
	};
	const funcs = { inc, add, xx, xxx };
	const w = await dask.get(dsk, 'w', funcs);
	console.log('w:', w);
}

test();
```
