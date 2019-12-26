if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {Vector} = require('..');

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


});
