const dask = require('../dist/dask');

function add(x, y) {
	console.log('pack:add');
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
