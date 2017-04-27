const dask = require('../dist/index');

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
