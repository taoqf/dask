const dask = require('../dist/index');
const ndarray = require('ndarray');

function print(arr) {
	const row = arr.shape[0];
	const col = arr.shape[1];
	for(let r = 0; r < row; ++r) {
		const a = [];
		for (let c = 0; c < col; ++c) {
			a.push(arr.get(r, c));
		}
		console.log(a.join(', '));
	}
	return arr;
}

function hi(arr, row, col){
	return arr.hi(row, col);
}

function lo(arr, row, col){
	return arr.lo(row, col);
}

function step(arr, step){
	return arr.step(step);
}

async function test() {
	const mat = ndarray(new Float64Array([1, 0, 0, 1]), [2,2]);
	// console.info(mat.get());
	const dsk = {
		data:	[
					0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
					10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
					20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
					30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
					40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
					50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
					60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
					70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
					80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
					90, 91, 92, 93, 94, 95, 96, 97, 98, 99
				],
		shape: [10, 10],
		x: {
			ndarray: ['data', 'shape']
		},
		y: {
			hi: ['x', 6, 6]
		},
		z: {
			lo: ['y', 2, 2]
		},
		evens: {
			step: ['z', 2]
		},
		odds1: {
			lo: ['z', 1]
		},
		odds: {
			step: ['odds1', 2]
		}
	};
	const funcs = { ndarray, hi, lo, step };
	const z = await dask.get(dsk, 'z', funcs);
	const evens = await dask.get(dsk, 'evens', funcs);
	const odds = await dask.get(dsk, 'odds', funcs);
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz');
	print(z);
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz');
	console.log('evensevensevensevensevensevens');
	print(evens);
	console.log('evensevensevensevensevensevens');
	console.log('oddsoddsoddsoddsoddsoddsodds');
	print(odds);
	console.log('oddsoddsoddsoddsoddsoddsodds');
	process.exit();
}

test();
