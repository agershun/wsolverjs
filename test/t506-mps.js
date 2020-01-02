if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {LpMps, LpGeneral, Matrix, Vector, almost} = require('..');
}

describe('506. readMps() prob2.mps ', function() {

	it('506.1.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob2.mps').then(function(p) {
			assert.equal(p.filename,'test/mps/prob2.mps');
			assert.equal(p.name,'prob2');
			assert.equal(p.dir,wsolver.DIR_MIN);
			let g = p.toGeneral();
			let s = g.toStandard();
			// console.log(16,s.A.toString());
			// console.log(17,s.b.data);
			s.solve();
			g.fromStandard(s);
			// console.log(20,g.objVal);
			// console.log(21,g.x.data);
			// console.log(22,g.objVal);
			assert(almost(g.objVal,965.8031372549019));
			assert(g.x.almost([ 0.07843137254901955, 0.3333333333333333, 0.5882352941176471 ]));
			done();
		});
	});

});
