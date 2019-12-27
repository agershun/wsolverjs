if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {Matrix,Vector,EPSILON,almost} = require('..');
}

describe('31.Matrix 2', function() {
	it('31.1.Matrix.copyFrom(Matrix, row, col)', function(done) {
		const a = Matrix.init([
			[1,2],
			[3,4]
		]);
		const b = Matrix.zeros(4,5);
		b.copyFrom(a,1,1);
		assert.deepEqual(b.data,[
			[0,0,0,0,0],
			[0,1,2,0,0],
			[0,3,4,0,0],
			[0,0,0,0,0],
		]);
		done();
	});

	it('31.2.Matrix.neg()', function(done) {
		const a = Matrix.init([
			[1,2],
			[3,4]
		]);
		const b = a.neg();
		assert.deepEqual(b.data,[
			[-1,-2],
			[-3,-4]
		]);
		done();
	});

	it('32.1.Matrix.slice()', function(done) {
		const a = Matrix.init([
			[1,2,3,4,5],
			[6,7,8,9,10],
			[11,12,13,14,15]
		]);
		const b = a.slice(1,2);
		assert.deepEqual(b.data,[
			[8,9,10],
			[13,14,15]
		]);
		done();
	});

	it('32.2.Matrix.slice()', function(done) {
		const a = Matrix.init([
			[1,2,3,4,5],
			[6,7,8,9,10],
			[11,12,13,14,15]
		]);
		const b = a.slice(1,2,2,4);
		assert.deepEqual(b.data,[
			[8,9],
		]);
		done();
	});

	it('32.3.Matrix.eye(number)', function(done) {
		const a = Matrix.eye(3);
		assert.equal(a.rsize,3);
		assert.equal(a.csize,3);
		assert.deepEqual(a.data,[
			[1,0,0],
			[0,1,0],
			[0,0,1],
		]);
		done();
	});


});
