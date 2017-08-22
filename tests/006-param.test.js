const dask = require('../dist/index');

describe('param', () => {
	it('add', async () => {
		function add(x, y) {
			return x + y;
		}

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
		w.should.eql(6);
	});
});
