if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {Vector,Matrix,almost,EPSILON} = require('..');

}

describe('20.Vector', function() {
	it('20.1.Vector.constructor()', function(done) {
		const v = new Vector(3);
		assert.equal(v.size,3)
		assert.equal(v.data.length,3)
		done();
	});

	it('20.2.Vector.zeros()', function(done) {
		const v = Vector.zeros(3);
		assert.equal(v.size,3)
		assert.equal(v.data.length,3)
		assert.deepEqual(v.data,[0,0,0])
		done();
	});

	it('20.3.Vector.ones()', function(done) {
		const v = Vector.ones(3);
		assert.equal(v.size,3)
		assert.equal(v.data.length,3)
		assert.deepEqual(v.data,[1,1,1])
		done();
	});


	it('20.4.Vector.init()', function(done) {
		const v = Vector.init([1,2,3]);
		assert.equal(v.size,3)
		assert.equal(v.data.length,3)
		assert.deepEqual(v.data,[1,2,3])
		done();
	});

	it('20.5.Vector.dot(Vector)', function(done) {
		const a = Vector.init([1,2,3]);
		const b = Vector.init([1,2,3]);
		const res = a.dot(b);
		assert.equal(res,14)
		done();
	});

	it('20.6.Vector.clone()', function(done) {
		const a = Vector.init([1,2,3]);
		const b = a.clone();
		assert.deepEqual(a,b);
		a.data[0] = 99;
		assert.notDeepEqual(a,b);
		done();
	});

	it('20.7.Vector.dot(Matrix)', function(done) {
		const a = Vector.init([2,1,0]);
		const B = Matrix.init([
			[2,1],
			[-1,-3],
			[1,0]
		]);
		let r = a.dot(B);
		assert.deepEqual(r.data,[3,-1]);
		done();
	});


	it('20.8.1.Vector.dot(Vector)', function(done) {
		const a = Vector.init([1,2,3]);
		const b = Vector.init([3,2,1]);
		let r = a.dot(b);
		assert.equal(r,10);
		r = b.dot(a);
		assert.equal(r,10);
		done();
	});


	it('20.8.2.Vector.dot(Vector)', function(done) {
		const c = Vector.init([70,80,85,0,0,0]);
		const x = Vector.init([636,330,33,2280,0,0]);
		const y = c.dot(x);
		assert.equal(y,73725);
		done();
	});

	it('20.9.Vector.dot(Number)', function(done) {
		const a = Vector.init([1,2,3]);
		const n = 3;
		let r = a.dot(n);
		assert.deepEqual(r.data,[3,6,9]);
		done();
	});

	it('20.10.1.Vector.almost(Number)', function(done) {
		const a = Vector.init([1,2,3]);
		const r = Vector.init([1+EPSILON/2,2+EPSILON/3,3+EPSILON/4]);
		assert.notDeepEqual(a,r);
		assert(a.almost(r));
		done();
	});

	it('20.10.1.not Vector.almost(Number)', function(done) {
		const a = Vector.init([1,2,3]);
		const r = Vector.init([1+2*EPSILON,2+EPSILON/3,3+EPSILON/4]);
		assert.notDeepEqual(a,r);
		assert(!a.almost(r));
		done();
	});



});
