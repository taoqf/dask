const dask = require('../dist/index');

describe('const', () => {
	it('should return 3', async () => {
		const x = 1;
		function add(y) {
			return x + y;
		}

		const dsk = {
			y: 2,
			z: {
				add: ['y']
			}
		};
		const funcs = { add };
		const z = await dask.get(dsk, 'z', funcs);
		z.should.equal(3);
	});
});
