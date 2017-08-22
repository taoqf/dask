const dask = require('../dist/index');

describe('cache', () => {
	it('fun add should be called only once', async () => {
		let count = 0;
		function add(x, y) {
			++count;
			return x + y;
		}

		const dsk = {
			x: 1,
			y: 2,
			z: {
				add: ['x', 'y']
			},
			u: 'z',
			v: 'z',
			w: {
				add: ['v', 'u']
			}
		};
		const funcs = { add };
		const w = await dask.get(dsk, 'w', funcs);
		w.should.equal(6);
		count.should.equal(2);
	});
});
