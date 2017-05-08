const dask = require('../dist/index');

function add(x, y) {
	console.log('param: add', x, y);
	return x + y;
}

async function test() {
	const dsk = {
		x: 1,
		y: 2,
		z: {
			add: [1, 2]
		},
		u: 'z',
		v: 'z',
		w: {
			add: ['v', 'u']
		}
	};
	const funcs = { add };
	const w = await dask.get(dsk, 'w', funcs);
	console.log('param:w:', w);
}

test();
