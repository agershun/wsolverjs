if (typeof exports === 'object') {
	var assert = require('assert');
	var {LpProblem,Matrix,Vector,almost,LP_METHOD_BRUTE,LP_METHOD_INTPOINT,LP_METHOD_SIMPLEX} = require('..');
}

describe('51. LpProblem ', function() {
	it('51.1.LpProblem.initStandard() and solve()', function(done) {
		const c = Vector.init([70,80,85,0,0,0]);
		const a = Matrix.init([
				[1,1,1,0,0,0],
				[1,4,8,1,0,0],
				[40,30,20,0,1,0],
				[3,2,4,0,0,1]
			]);		
		const b = Vector.init([999,4500,36000,2700]);
		const x = Vector.init([636,330,33,2280,0,0]);
		const y = c.dot(x);
		const p = LpProblem.initStandard(c,a,b);
		p.solveStandard();
		assert(almost(p.optVal,y));
		done();
	});

	it('51.2.LpProblem.initStandard() and solveStandard() with different methods', function(done) {
		const c = Vector.init([70,80,85,0,0,0]);
		const a = Matrix.init([
				[1,1,1,0,0,0],
				[1,4,8,1,0,0],
				[40,30,20,0,1,0],
				[3,2,4,0,0,1]
			]);		
		const b = Vector.init([999,4500,36000,2700]);
		const x = Vector.init([636,330,33,2280,0,0]);
		const y = c.dot(x);
		const p = LpProblem.initStandard(c,a,b);
		p.method = LP_METHOD_BRUTE;
		p.solveStandard();
		let y1 = p.optVal;

		p.method = LP_METHOD_INTPOINT;
		p.solveStandard();
		let y2 = p.optVal;

		p.method = LP_METHOD_SIMPLEX;
		p.solveStandard();
		let y3 = p.optVal;

		assert(almost(y,y1));
		assert(almost(y,y2));
		assert(almost(y,y3));
		done();
	});

});

