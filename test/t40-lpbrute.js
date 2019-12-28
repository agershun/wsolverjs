if (typeof exports === 'object') {
	var assert = require('assert');
	var {solveLpBrute,Matrix,Vector,almost} = require('..');
}

describe('40.solveLpBrute()', function() {
	it('40.1.Simple lp problem', function(done) {
		const c = Vector.init([70,80,85,0,0,0]);
		const A = Matrix.init([
				[1,1,1,0,0,0],
				[1,4,8,1,0,0],
				[40,30,20,0,1,0],
				[3,2,4,0,0,1]
			]);		
		const b = Vector.init([999,4500,36000,2700]);
		const x = Vector.init([636,330,33,2280,0,0]);
		const y = c.dot(x);
		assert.equal(y,73725);

		const x0 = solveLpBrute(c,A,b);
		assert(x.almost(x0));
		const y0 = c.dot(x0);
		assert(almost(y0,73725));
		done();
	});

	it('40.2.Bigger lp problem', function(done) {
		const c = Vector.init([-1.,-1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.]);
		const A = Matrix.init([
			[1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.],
			[0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.],
			[0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.],
			[0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.],
			[0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.],
			[0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.],
			[0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.],
			[0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.],
			[0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.],
			[0.,0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,1.],
			[-1.,0.,1.,1.,-1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.],
			[0.,-1.,-1.,0.,1.,1.,-1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.],
			[0.,0.,0.,-1.,0.,0.,1.,1.,-1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.],
			[0.,0.,0.,0.,0.,-1.,0.,0.,1.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.]
		]);
		const b = Vector.init([16.,13.,10.,12.,4.,14.,9.,20.,7.,7.,0.,0.,0.,0.]);
		const x = Vector.init([
		    13, 13, 5, 12, 4, 14, 0,
		    19,  7, 7,  3, 0,  5, 0,
		     0,  0, 9,  1, 0,  0
		]);
		const y = c.dot(x);
		const x0 = solveLpBrute(c,A,b);
		const y0 = c.dot(x0);
// console.log('brute',x0,y0);
		assert(almost(y,y0));
		assert(x.almost(x0));
		done();
	});

	it('40.3.Nonsolvable lp problem', function(done) {
		const c = [3,2];
		const A = [
				[1,1],
				[3,1],
				[1,0],
				[0,1]
			];		
		const b = [9,18,7,6];
		const x0 = -1;
		const x = solveLpBrute(c,A,b);
		assert.deepEqual(x,x0);
		done();
	});


});