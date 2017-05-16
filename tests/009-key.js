const dask = require('../dist/index');

function add(x, y) {
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
	const z = await dask.get(dsk, 'z', funcs);
	console.log('z:', z);
}

test();
