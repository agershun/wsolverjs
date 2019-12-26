if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {Matrix} = require('..');
}

describe('30.Matrix', function() {
	it('30.1.Matrix.constructor', function(done) {
		const m = new Matrix(3,4);
		assert.equal(m.rsize,3);
		assert.equal(m.csize,4);
		assert.equal(m.data.length,3);
		assert.equal(m.data[0].length,4);
		done();
	});

	it('30.2.Matrix.zeros()', function(done) {
		const m = Matrix.zeros(3,4);
		assert.equal(m.rsize,3);
		assert.equal(m.csize,4);
		assert.deepEqual(m.data,[
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0]
		]);
		done();
	});

	it('30.3.Matrix.ones()', function(done) {
		const m = Matrix.ones(3,4);
		assert.equal(m.rsize,3);
		assert.equal(m.csize,4);
		assert.deepEqual(m.data,[
			[1,1,1,1],
			[1,1,1,1],
			[1,1,1,1]
		]);
		done();
	});


	it('30.4.Matrix.init()', function(done) {
		const m = Matrix.init([
			[1,2,3,4],
			[5,6,7,8],
			[9,0,1,2]
		]);
		assert.equal(m.rsize,3);
		assert.equal(m.csize,4);
		assert.deepEqual(m.data,[
			[1,2,3,4],
			[5,6,7,8],
			[9,0,1,2]
		]);
		done();
	});

	it('30.5.Matrix.trans()', function(done) {
		const m = Matrix.init([
			[1,2,3,4],
			[5,6,7,8],
			[9,0,1,2]
		]);
		const t = m.trans();
		assert.equal(t.rsize,4);
		assert.equal(t.csize,3);
		assert.deepEqual(t.data,[
			[1,5,9],
			[2,6,0],
			[3,7,1],
			[4,8,2]
		]);
		done();
	});


});
