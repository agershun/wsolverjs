if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {LpMps, LpGeneral, LpProblem, solveLpBrute,Matrix, Vector, almost} = require('..');
}

describe('52. LpGeneral.toStandard() ', function() {
/*
		min: +XONE +4 YTWO +9 ZTHREE;
		LIM1: +XONE +YTWO <= 5;
		LIM2: +XONE +ZTHREE >= 10;
		MYEQN: -YTWO +ZTHREE = 7;
		XONE <= 4;
		YTWO >= -1;
		YTWO <= 1;
*/		

	it('55.1.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob1.mps').then(function(p) {
			let g = p.toGeneral();
			let s = g.toStandard();
			// console.log(22,s.A.toString());
			// console.log(23,s.b.data);
			s.solve();
			// let x = solveLpBrute(s.c,s.A,s.b);
			// console.log(24,s.x.data);
			// console.log(25,s.optVal);
			g.fromStandard(s);
			// console.log(28,g.x);
			// console.log(29,g.objVal);
			assert.deepEqual(g.x.data,[4,-1,6]);
			assert.equal(g.objVal,54);
			done();
		});
	});

	it('55.1.1 Check the standard view', function(done) {
		let A = Matrix.init([
			[ 0, 1, 0, 0, 1, 0, 0],
			[-1, 1, 0, 0, 0, 1, 0],
			[ 1, 0,-1,-1, 0, 0, 1],
			[ 0,-1, 1, 1, 0, 0, 0],
		]);
		let b = Vector.init([2,0,-6,6]);
		let c = Vector.init([-1,4,9,9,0,0,0])
		let x = solveLpBrute(c,A,b);
		let x1 = x.slice(0,4);
		assert.deepEqual(x1.data,[0,0,6,0]);
		assert.equal(c.dot(x),54)
		// console.log(x1);
		// // console.log(c.dot(x)-8);
		done();
	});
});