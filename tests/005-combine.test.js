const dask = require('../dist/index');

describe('combine', () => {
	it('fun add should be called only once', async () => {
		// this.timeout(5000);
		function inc(x) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(++x);
				}, 100);
			});
		}

		function add(x, y) {
			return x + y;
		}

		function xx() {
			return 1;
		}

		function xxx() {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(1);
				}, 3000);
			});
		}

		const dsk = {
			x1: {
				xx: []
			},
			x2: {
				xxx: []
			},
			x3: {
				add: ['x2', 'y']
			},
			y: 2,
			z: {
				add: ['x1', 'x3']
			},
			u: 'z',
			v: {
				inc: ['u']
			},
			w: {
				add: ['v', 'z']
			}
		};
		const funcs = { inc, add, xx, xxx };
		const w = await dask.get(dsk, 'w', funcs);
		w.should.eql(9);
	}).timeout(5000);
});
