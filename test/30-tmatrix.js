if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {Matrix} = require('..');
}

describe('30.Matrix', function() {
	it('30.1.Matrix.constructor()', function(done) {
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

	it('30.6.Matrix.selectRows(rows)', function(done) {
		const m = Matrix.init([
			[1,2,3,4],
			[5,6,7,8],
			[9,0,1,2]
		]);
		const t = m.selectRows([0,2]);
		assert.equal(t.rsize,2);
		assert.equal(t.csize,4);
		assert.deepEqual(t.data,[
			[1,2,3,4],
			[9,0,1,2]
		]);
		done();
	});

	it('30.7.Matrix.clone()', function(done) {
		const m = Matrix.init([
			[1,2,3,4],
			[5,6,7,8],
			[9,0,1,2]
		]);
		const m1 = m.clone();
		assert.equal(m.rsize,3);
		assert.equal(m.csize,4);		
		assert.deepEqual(m,m1);
		m1.data[0][0] = 99;
		assert.notDeepEqual(m,m1);
		done();
	});

	it('30.8.Matrix.cloneData()', function(done) {
		const m = Matrix.init([
			[1,2,3,4],
			[5,6,7,8],
			[9,0,1,2]
		]);
		const data = m.cloneData();
		assert.equal(data.length,3);
		assert.equal(data[0].length,4);
		assert.deepEqual(m.data,data);
		data[0][0] = 99;
		assert.notDeepEqual(m.data,data);
		done();
	});

	it('30.9.Matrix.rank()', function(done) {
		const m = Matrix.init([
			[ 1,  2,  3,  4],
			[ 5,  6,  7,  8],
			[ 9, 10, 11, 12]
		]);
		const r = m.rank();
		assert.equal(r,2);
		done();
	});

	it('30.10.Matrix.rref()', function(done) {
		const m = Matrix.init([
			[ 1,  2,  3,  4],
			[ 5,  6,  7,  8],
			[ 9, 10, 11, 12]
		]);
		const r = m.rref();
		assert.deepEqual(r.pivots,[0,1]);
		assert.deepEqual(r.data,[
			[1, 0,-1,-2],
			[0, 1, 2, 3],
			[0, 0, 0, 0]
		]);

		done();
	});

});
