const dask = require('../dist/index');

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
