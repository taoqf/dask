const dask = require('../dist/index');

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
