const dask = require('../dist/index');

describe('promise', () => {
	it('should return 3', async () => {
		function add(x, y) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(x + y);
				}, 100);
			});
		}

		const dsk = {
			x: 1,
			y: 2,
			z: {
				add: ['x', 'y']
			}
		};
		const funcs = { add };
		const z = await dask.get(dsk, 'z', funcs);
		z.should.equal(3);
	});
});
