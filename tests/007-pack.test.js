const dask = require('../dist/dask');

describe('pack', () => {
	it('add', async () => {
		function add(x, y) {
			return x + y;
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
		z.should.eql(3);
	});
});
