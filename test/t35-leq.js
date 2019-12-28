if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {Matrix,Vector,EPSILON,almost,solveLeqGauss} = require('..');
}

describe('35.Linear Equations by Gauss method', function() {
	it('35.1. 2x2', function(done) {
		let a = Matrix.init([
			[1,-1],
			[2,1]
		]);
		let b = Vector.init([-5,-7]);
		let x = Vector.init([-4,1]);
		let x0 = solveLeqGauss(a,b);
		assert(x.almost(x0));
		done();
	});

	it('35.2. 3x3', function(done) {
		let a = Matrix.init([
			[3,2,-5],
			[2,-1,3],
			[1,2,-1]
		]);
		let b = Vector.init([-1,13,9]);
		let x = Vector.init([3,5,4]);
		let x0 = solveLeqGauss(a,b);
		assert(x.almost(x0));
		done();
	});

	it('35.3. 3x3', function(done) {
		let a = Matrix.init([
			[4,2,-1],
			[5,3,-2],
			[3,2,-3]
		]);
		let b = Vector.init([1,2,0]);
		let x = Vector.init([-1,3,1]);
		let x0 = solveLeqGauss(a,b);
		assert(x.almost(x0));
		done();
	});

	it('35.4. 4x4', function(done) {
		let a = Matrix.init([
			[2,5,4,1],
			[1,3,2,1],
			[2,10,9,7],
			[3,8,9,2],
		]);
		let b = Vector.init([20,11,40,37]);
		let x = Vector.init([1,2,2,0]);
		let x0 = solveLeqGauss(a,b);
		assert(x.almost(x0));
		done();
	});

	it('35.4. Non solvable 3x3', function(done) {
		let a = Matrix.init([
			[1,1,1],
			[1,1,2],
			[1,1,3]
		]);
		let b = Vector.init([1,3,-1]);
		let x0 = solveLeqGauss(a,b);
		assert.equal(x0,-1);
		done();
	});

});
