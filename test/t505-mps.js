if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {LpMps, LpGeneral, Matrix, Vector, almost} = require('..');
}

describe('505. readMps() ', function() {
/*
		min: +XONE +4 YTWO +9 ZTHREE;
		LIM1: +XONE +YTWO <= 5;
		LIM2: +XONE +ZTHREE >= 10;
		MYEQN: -YTWO +ZTHREE = 7;
		XONE <= 4;
		YTWO >= -1;
		YTWO <= 1;
*/		


	it('505.1.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob1.mps').then(function(p) {
			assert.equal(p.filename,'test/mps/prob1.mps');
			assert.equal(p.name,'TESTPROB');
			assert.equal(p.dir,wsolver.DIR_MIN);

			assert.deepEqual(p.rows, {
				LIM1: { name: 'LIM1', type: 'L', coeffs: {XONE: 1,YTWO: 1}, rhs: 5 },
				LIM2: { name: 'LIM2', type: 'G', coeffs: {XONE: 1,ZTHREE: 1}, rhs: 10 },
				MYEQN: { name: 'MYEQN', type: 'E', coeffs: {YTWO: -1,ZTHREE: 1}, rhs: 7 }					
			});
			if(false) {
				assert.deepEqual(p.cols, {
					XONE: { name: 'XONE', up: 4},
					YTWO: { name: 'YTWO', lo: -1, up: 1},
					ZTHREE: { name: 'ZTHREE'}
				});
			}
			assert.deepEqual(p.goal, {
				name: 'COST', 
				coeffs: { XONE: 1, YTWO: 4, ZTHREE: 9 } 
			});

			let g = p.toGeneral();
			assert.equal(g.c.size,3);
			assert.deepEqual(g.c.data,[1,4,9]);

			assert.equal(g.A.rsize,3);
			assert.equal(g.A.csize,3);
			assert.deepEqual(g.A.data,[
 				[ 1, 1, 0 ], 
 				[ 1, 0, 1 ], 
 				[ 0, -1, 1 ]
			]);

			assert.deepEqual(g.L,[-Infinity,10,7]);
			assert.deepEqual(g.U,[5,Infinity,7]);
			assert.deepEqual(g.l,[0,-1,0]);
			assert.deepEqual(g.u,[4,1,Infinity]);
			assert.deepEqual(g.v,[ 'XONE', 'YTWO', 'ZTHREE' ]);
			assert.deepEqual(g.n,[ 'LIM1', 'LIM2', 'MYEQN' ]);
			assert.deepEqual(g.t,[undefined,undefined,undefined]);

			// let s = g.toStandard();

			

			// console.log(29,p.rows.MYEQN);
			// console.log(p.A.data);
			// console.log(p.b.data);
			// Prepare
/*			
			assert.equal(p.A.rsize,6);
			assert.equal(p.A.csize,3);
			assert.deepEqual(p.A.data,[
				[ 1, 0, 0, 0, 0, 0 ],
				// [ 0, 1, 0, 0, 0, 0 ],
				[ 0, -1, 0, 0, 0, 0 ],
				[ 1, 1, 0, 0, 0, 0 ],
				[ -1, 0, -1, 0, 0, 0 ],
				[ 0, -1, 1, 0, 0, 0],
				// [ 0, 1, -1 ]
			]);

			assert.equal(p.b.size,7);
			assert.deepEqual(p.b.data,[4, 1,  1, 5,-10, 7, -7]);

			assert.equal(p.c.size,3);
			assert.deepEqual(p.c.data,[ 1, 4, 9 ]);

			// console.log(21,p.A);
			// console.log(22,p.b);
			// console.log(23,p.c);
			// p.solve();
			console.log(22,p.x);
*/			
			done();
		});
	});

	it('505.2.readMps() netlib AFIRO', function(done) {
		LpMps.read('test/netlib/AFIRO.sif').then(function(p) {
			assert.equal(p.filename,'test/netlib/AFIRO.sif');
			assert.equal(p.name,'AFIRO');
			assert.equal(p.dir,wsolver.DIR_MIN);
			assert.equal(p.goal.name,'COST');
			assert.deepEqual(p.goal.coeffs,{ X02: -0.4, X14: -0.32, X23: -0.6, X36: -0.48, X39: 10 });
			assert.deepEqual(p.cols,{
				X01: { name: 'X01' },
				X02: { name: 'X02' },
				X03: { name: 'X03' },
				X04: { name: 'X04' },
				X06: { name: 'X06' },
				X07: { name: 'X07' },
				X08: { name: 'X08' },
				X09: { name: 'X09' },
				X10: { name: 'X10' },
				X11: { name: 'X11' },
				X12: { name: 'X12' },
				X13: { name: 'X13' },
				X14: { name: 'X14' },
				X15: { name: 'X15' },
				X16: { name: 'X16' },
				X22: { name: 'X22' },
				X23: { name: 'X23' },
				X24: { name: 'X24' },
				X25: { name: 'X25' },
				X26: { name: 'X26' },
				X28: { name: 'X28' },
				X29: { name: 'X29' },
				X30: { name: 'X30' },
				X31: { name: 'X31' },
				X32: { name: 'X32' },
				X33: { name: 'X33' },
				X34: { name: 'X34' },
				X35: { name: 'X35' },
				X36: { name: 'X36' },
				X37: { name: 'X37' },
				X38: { name: 'X38' },
				X39: { name: 'X39' }
			});

			// console.log(p.rows);
			// console.log(p.rows);
			let g = p.toGeneral();
			// console.log(g.L);
			done();
			// assert.equal(p.name,'TESTPROB');
			// assert.equal(p.dir,wsolver.DIR_MIN);
		});
	});

	it('505.2.readMps() netlib BLEND', function(done) {
		LpMps.read('test/netlib/BLEND.sif').then(function(p) {
			assert.equal(p.filename,'test/netlib/BLEND.sif');
			assert.equal(p.name,'BLEND');
			assert.equal(p.dir,wsolver.DIR_MIN);
			assert.equal(p.goal.name,'C');
			// console.log(p);
			done();
		});
	});	

	it('55.2.readMps() netlib SHARE2B', function(done) {
		LpMps.read('test/netlib/SHARE2B.sif').then(function(p) {
			assert.equal(p.filename,'test/netlib/SHARE2B.sif');
			assert.equal(p.name,'SHARE2B');
			assert.equal(p.dir,wsolver.DIR_MIN);
			assert.equal(p.goal.name,'000000');
			// console.log(p);
			let g = p.toGeneral();
			// console.log(g);

			done();
		});
	});	

/*
	it('505.2.solve() the Matrix problem by 3 methods', function(done) {
		let A = Matrix.init([
				[  1, 0, 0, 1, 0, 0, 0, 0 ],
				[  0,-1, 0, 0, 1, 0, 0, 0 ],
				[  0, 1, 0, 0, 0, 1, 0, 0 ],
				[  1, 1, 0, 0, 0, 0, 1, 0 ],
				[ -1, 0,-1, 0, 0, 0, 0, 1 ],
				[  0,-1, 1, 0, 0, 0, 0, 0 ],
			]);
		let b = Vector.init([4, 1,  1, 5,-10, 7]);
		let c = Vector.init([ 1, 4, 9, 0, 0, 0, 0, 0 ]);
		let x = Vector.init([3.00000000e+00, 2.77021948e-10, 6.99999999e+00, 1.00000000e+00,
   				9.99999999e-01, 1.00000000e+00, 2.00000000e+00, 2.85176252e-10]);
   		let y = c.dot(x);
   		// console.log(75,y);
   		assert(almost(y,66));

		let p1 = LpProblem.init(c,A,b);
		p1.method = wsolver.LP_METHOD_BRUTE;
		p1.solve();
		assert(almost(p1.optVal,66));
		assert(p1.x.almost(x));

		let p2 = LpProblem.init(c,A,b);
		p2.method = wsolver.LP_METHOD_INTPOINT;
		p2.solve();
		assert(almost(p2.optVal,66));
		assert(p2.x.almost(x));

		let p3 = LpProblem.init(c,A,b);
		p3.method = wsolver.LP_METHOD_SIMPLEX;
		p3.solve();
   		// console.log(81,p3.optVal);
		assert(almost(p3.optVal,y));
		assert(p3.x.almost(x));

		done();
	});
*/
// 4,-1, 6 => 54
/*
	it('505.3.solve() the Matrix problem by 3 methods', function(done) {
		let A = Matrix.init([
				[  1, 0, 0, 1, 0, 0, 0, 0 ],
				[  0,-1, 0, 0, 1, 0, 0, 0 ],
				[  0, 1, 0, 0, 0, 1, 0, 0 ],
				[  1, 1, 0, 0, 0, 0, 1, 0 ],
				[ -1, 0,-1, 0, 0, 0, 0, 1 ],
				[  0,-1, 1, 0, 0, 0, 0, 0 ],
			]);
		let b = Vector.init([4, 1,  1, 5,-10, 7]);
		let c = Vector.init([ 1, 4, 9, 0, 0, 0, 0, 0 ]);

		// for(let i=0;i<A.rsize;i++) {
		// 	b.data[i] += A.data[i][1];
		// }

		// let x = Vector.init([3, 0, 7, 1, 1, 1, 2, 0]);
   		// let y = c.dot(x);
   		// console.log(75,y);
   		// assert(almost(y,66));

		let p1 = LpProblem.init(c,A,b);
		p1.method = wsolver.LP_METHOD_BRUTE;
		p1.solve();
		// p1.x[]
		console.log(119,p1.x);
		assert(almost(p1.optVal,66));
		done();
		return;
		assert(p1.x.almost(x));

		let p2 = LpProblem.init(c,A,b);
		p2.method = wsolver.LP_METHOD_INTPOINT;
		p2.solve();
		assert(almost(p2.optVal,66));
		assert(p2.x.almost(x));

		let p3 = LpProblem.init(c,A,b);
		p3.method = wsolver.LP_METHOD_SIMPLEX;
		p3.solve();
   		// console.log(81,p3.optVal);
		assert(almost(p3.optVal,y));
		assert(p3.x.almost(x));
		done();
	});
*/

});
