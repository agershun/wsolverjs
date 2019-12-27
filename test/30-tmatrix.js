if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {Matrix,Vector,EPSILON,almost} = require('..');
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

	it('30.9.1.Matrix.rank()', function(done) {
		const m = Matrix.init([
			[ 1,  2,  3,  4],
			[ 5,  6,  7,  8],
			[ 9, 10, 11, 12]
		]);
		const r = m.rank();
		assert.equal(r,2);
		done();
	});


	it('30.9.2.Matrix.rank()', function(done) {
		const m = Matrix.init([
			[2,-1,3],
			[1,0,1],
			[0,2,-1],
			[1,1,4],
		]);
		const r = m.rank();
		assert.equal(r,3);
		done();
	});

	it('30.9.3.Matrix.rank()', function(done) {
		const m = Matrix.init([
			[1,-1,1,-1],
			[-1,1,-1,1],
			[1,-1,1,-1],
			[-1,1,-1,1],
		]);
		const r = m.rank();
		assert.equal(r,1);
		done();
	});

	it('30.9.4.Matrix.rank()', function(done) {
		const A = Matrix.init([
				[1,1,1,0,0,0],
				[1,4,8,1,0,0],
				[40,30,20,0,1,0],
				[3,2,4,0,0,1]
			]);	
		const r = A.rank();
		assert.equal(r,4);
		done();
	});

	it('30.9.5.Matrix.rank()', function(done) {
		const A = Matrix.init([
			[10,20,10],
			[-20,-30,10],
			[30,50,0],
		]);	
		const r = A.rank();
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

	it('30.11.Matrix.dot(Vector)', function(done) {
		const a = Vector.init([2,1,0]);
		const B = Matrix.init([
			[1,-1,2],
			[0,-3,1]
		]);
		const r = B.dot(a);
		assert.deepEqual(r.data,[1,-3]);
		done();
	});

	it('30.12.Matrix.dot(Number)', function(done) {
		const B = Matrix.init([
			[1,-1,2],
			[0,-3,1]
		]);
		let r = B.dot(2);
		assert.deepEqual(r.data,[
			[2,-2,4],
			[0,-6,2]
		]);
		r = B.dot(-1);
		assert.deepEqual(r.data,[
			[-1,1,-2],
			[0,3,-1]
		]);
		done();
	});

	it('30.13.Matrix.dot(Matrix)', function(done) {
		const A = Matrix.init([
			[0,4,-2],
			[-4,-3,0]
		]);
		const B = Matrix.init([
			[0,1],
			[1,-1],
			[2,3],
		]);

		const r = A.dot(B);
		assert.deepEqual(r.data,[
			[0,-10],
			[-3,-1]
		]);
		done();
	});

	it('30.14.1.Matrix.inv()', function(done) {
		const A = Matrix.init([
			[4,7],
			[2,6]
		]);
		const R = Matrix.init([
			[0.6,-0.7],
			[-0.2,0.4]
		]);
		const R1 = A.inv();
		assert(R.almost(R1));
		done();
	});

	it('30.14.2.Matrix.inv()', function(done) {
		const A = Matrix.init([
			[3,3.5],
			[3.2,3.6]
		]);
		const R = Matrix.init([
			[-9,8.75],
			[8,-7.5]
		]);
		const R1 = A.inv();
		assert(R.almost(R1));
		done();
	});

	it('30.15.1.Matrix.almost()', function(done) {
		const A = Matrix.init([
			[1,1],
			[1,1]
		]);
		const B = Matrix.init([
			[1+EPSILON/2,1],
			[1,1]
		]);
		assert.notDeepEqual(A.data,B.data);
		assert(A.almost(B));

		done();
	});

	it('30.15.2.not Matrix.almost()', function(done) {
		const A = Matrix.init([
			[1,1],
			[1,1]
		]);
		const B = Matrix.init([
			[1+2*EPSILON,1],
			[1,1]
		]);
		assert.notDeepEqual(A.data,B.data);
		assert(!A.almost(B));

		done();
	});

});
