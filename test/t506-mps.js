if (typeof exports === 'object') {
	var assert = require('assert');
	var wsolver = require('..');
	var {LpMps, LpGeneral, Matrix, Vector, almost} = require('..');
}

describe('506. readMps() Multiple problems', function() {

	it('506.1.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob1.mps').then(function(p) {
			let g = p.solve();
			let s = g.toStandard();
			s.solve();
			g.fromStandard(s);
			// console.log(12,g.toString());
			// console.log(14,s.toString());
			// console.log(15,g.vars);
			// console.log(15,g.rows);
			assert.deepEqual(g.vars,{ XONE: 4, YTWO: -1, ZTHREE: 6 });
			assert.deepEqual(g.rows,{ COST: 54, LIM1: 3, LIM2: 10, MYEQN: 7 });
			done();
		});
	});
	it('506.2.1.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob2.mps').then(function(p) {
			assert.equal(p.filename,'test/mps/prob2.mps');
			assert.equal(p.name,'prob2');
			assert.equal(p.dir,wsolver.DIR_MIN);
			let g = p.toGeneral();
			let s = g.toStandard();
			s.solve();
			// console.log(29,g.toString());
			// console.log(29,s.toString());
			g.fromStandard(s);
			assert(almost(g.objVal,965.8031372549019));
			assert(g.x.almost([ 0.07843137254901955, 0.3333333333333333, 0.5882352941176471 ]));
			done();
		});
	});


	it('506.2.2.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob2.mps').then(function(p) {
			let g = p.toGeneral();
			let s = g.toStandard();
			s.solve();
			g.fromStandard(s);
			assert(almost(g.objVal,965.8031372549019));
			assert(g.x.almost([ 0.07843137254901955, 0.3333333333333333, 0.5882352941176471 ]));
			done();
		});
	});

	it('506.2.3.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob2.mps').then(function(p) {
			let g = p.solve();
			assert(almost(g.objVal,965.8031372549019));
			assert(g.x.almost([ 0.07843137254901955, 0.3333333333333333, 0.5882352941176471 ]));
			// console.log(41,g.vars);
			assert.deepEqual(g.vars,{
				M1: 0.07843137254901955,
				M2: 0.3333333333333333,
				M3: 0.5882352941176471
			});
			assert.deepEqual(g.rows,{ CUSTO: 965.8031372549019, K: 20, N: 20, ONE: 1 });
			// console.log(41,g.rows);
			done();
		});
	});

	it('506.3.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob3.mps').then(function(p) {
			// let g = p.solve();
			// console.log(g.vars);
			let g = p.toGeneral();
			let s = g.toStandard();
// console.log(78);
			s.solve();
// console.log(79);
			g.fromStandard(s);
// console.log(80);
			// console.log(s);
			// console.log(68,g.toString());
			// console.log(69,s.toString());
			// console.log(g.objVal);
			// console.log(69,g.x);
			// console.log(g);
			// console.log(89,g.toString());
			// console.log(90,s.toString());

			// console.log(92,g.vars);
			// console.log(93,g.rows);
			// console.log(s.x.data);
			// console.log(s.c.dot(s.x));
			// console.log(95,s.A.row(9).dot(s.x));
			// console.log(g.objVal);
			// console.log(g.x.data);

			assert(almost(g.objVal,3.23684211));
			assert.deepEqual(g.rows,{
			  OBJ: 3.236842105263158,
			  ROW01: 2.5000000000000013,
			  ROW02: 2.1,
			  ROW03: 4,
			  ROW04: 6,
			  ROW05: 15
			});
			assert.deepEqual(g.vars,{
			  COL01: 2.5,
			  COL02: 1.05,
			  COL03: 0,
			  COL04: 2.6434210526315787,
			  COL05: 0.5,
			  COL06: 4,
			  COL07: 1.1679824561403496,
			  COL08: 0.26315789473684215
			});
			// assert(g.x.almost([2.5, 1.05, 0, 0.64285714, 0.5, 4, 0, 0.26315789 ]));
			done();
		});
	});
// }

	it('506.4.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob4.mps').then(function(p) {
			let g = p.solve();
			assert.deepEqual(g.vars,{ DCOL1: 0 });
			assert.deepEqual(g.rows,{ DOBJ: 0, DROW1: 0 });	
			done();
		});
	});

// if(false) {
	it('506.5.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob5.mps').then(function(p) {
			let g = p.solve();
			assert.deepEqual(g.vars,{ SUP1: 66.66666666666671, SUP2: 33.333333333333286, SUP3: 100 });
			assert.deepEqual(g.rows,{
			  AMOUNT: 200,
			  COST: 69.99999999999997,
			  PURITY: 10.000000000000004,
			  SUP1COST: 13.333333333333343,
			  SUP2COST: 26.66666666666663,
			  SUP3COST: 30
			});
			done();
		});
	});
// }

	it('506.6.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob6.mps').then(function(p) {
			let g = p.solve();
			assert.deepEqual(g.vars,{ SUP1: 25, SUP2: 75 });
			assert.deepEqual(g.rows,{ COST: 180, SUP1COST: 90, SUP2COST: 90, PURITY: 35, AMOUNT: 100 });	
			done();
		});
	});

// if(false) {
	it('506.7.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob7.mps').then(function(p) {
			let g = p.solve();
			assert.deepEqual(g.vars,{ SUP1: 100, SUP2: 150 });
			assert.deepEqual(g.rows,{
			  COST: 245,
			  SUP1COST: 140,
			  SUP2COST: 105,
			  PURITY: 11.500000000000002,
			  AMOUNT: 250
			});	
			done();
		});
	});
// }
	it('506.8.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob8.mps').then(function(p) {
			// console.log(178,p);
			let g = p.solve();
			let s = g.toStandard();
			s.solve();
			g.fromStandard(s);
			assert.deepEqual(g.rows,{ PROFIT: 2250, AMOUNT1: 12, AMOUNT2: 7, AMOUNT3: 9, AMOUNT4: 8 });
			assert.deepEqual(g.vars,{ RAW1: 5, RAW2: 3, RAW3: 4, PRODUCT: 500 });

			// console.log(163,g.toString());

			// console.log(164,s.toString());
			// console.log(93,g.vars);
			// console.log(94,g.rows);

			// assert.equal(g.objVal,2250);
			// assert.equal(g.rows.PROFIT,2250);
			// let s = g.toStandard();
			// console.log(163,g.toString());
			// console.log(164,s.toString());
			// console.log(93,g.vars);
			// console.log(94,g.rows);

			// console.log(g.objVal);
			// console.log(g.x.data);
			// console.log(g.rows);
			// console.log(g.vars);
			// assert(almost(g.objVal,3.23684211));
			// assert(g.x.almost([
			// 	2.5, 1.05, 0, 0.64285714, 0.5, 4, 0, 0.26315789 ]));
			done();
		});
	});

	it('506.9.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob9.mps').then(function(p) {
			let g = p.solve();
			// assert.deepEqual(g.vars,{ COL01: 1, COL02: 2, COL03: 2 });
			// assert.deepEqual(g.rows,{ OBJ: 7, ROW01: 3, ROW02: 0, ROW03: -3 });			
			let s = g.toStandard();
			// console.log(g.toString());
			// console.log(s.toString());
			// console.log(g.rows);
			// console.log(g.vars);
			assert.deepEqual(g.rows,{ OBJ: 7, ROW01: 3, ROW02: 0, ROW03: -3 });
			assert.deepEqual(g.vars,{ COL01: 1, COL02: 2, COL03: 2 });


			// console.log(g.objVal);
			// console.log(g.x.data);
			// assert(almost(g.objVal,3.23684211));
			// assert(g.x.almost([
			// 	2.5, 1.05, 0, 0.64285714, 0.5, 4, 0, 0.26315789 ]));
			done();
		});
	});
// if(false) {

	it('506.11.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob11.mps').then(function(p) {
			let g = p.toGeneral();
			let s = g.toStandard();
			// console.log(g);
			s.solve({method:wsolver.LP_METHOD_INTPOINT});
//			s.solve({method:wsolver.LP_METHOD_SIMPLEX});
			console.log(238,s.x);
			// let g = p.solve();
			// console.log(g.objVal);
			// console.log(g.x.data);
			// assert(almost(g.objVal,3.23684211));
			// assert(g.x.almost([
			// 	2.5, 1.05, 0, 0.64285714, 0.5, 4, 0, 0.26315789 ]));
			done();
		});
	});
// }

	it('506.12.readMps() to the problem', function(done) {
		LpMps.read('test/mps/prob12.mps').then(function(p) {
			let g = p.solve();
			assert.deepEqual(g.rows,{ 
			  OBJ: 3.236842105263158,
			  GUB01: 2.5000000000000013,
			  ROW02: 2.1,
			  ROW03: 4,
			  ROW04: 6,
			  ROW05: 15
			});
			assert.deepEqual(g.vars,{ 
			  COL01: 2.5,
			  COL02: 1.05,
			  COL03: 0,
			  COL04: 2.6434210526315787,
			  COL05: 0.5,
			  COL06: 4,
			  COL07: 1.1679824561403496,
			  COL08: 0.26315789473684215			
			});

			// console.log(g.vars);
			// console.log(g.rows);
			// console.log(g.objVal);
			// console.log(g.x.data);
			// assert(almost(g.objVal,3.23684211));
			// assert(g.x.almost([
			// 	2.5, 1.05, 0, 0.64285714, 0.5, 4, 0, 0.26315789 ]));
			done();
		});
	});



// if(false) {
	// it('506.13.readMps() to the problem', function(done) {
	// 	LpMps.read('test/mps/prob13.mps').then(function(p) {
	// 		let g = p.solve();
	// 		console.log(g.vars);
	// 		console.log(g.rows);
	// 		assert.deepEqual(g.rows,{ 
	// 		  OBJ: 3.236842105263158,
	// 		  GUB01: 2.5000000000000013,
	// 		  ROW02: 2.1,
	// 		  ROW03: 4,
	// 		  ROW04: 6,
	// 		  ROW05: 15
	// 		});
	// 		assert.deepEqual(g.vars,{ 
	// 		  COL01: 2.5,
	// 		  COL02: 1.05,
	// 		  COL03: 0,
	// 		  COL04: 2.6434210526315787,
	// 		  COL05: 0.5,
	// 		  COL06: 4,
	// 		  COL07: 1.1679824561403496,
	// 		  COL08: 0.26315789473684215			
	// 		});
	// 		done();
	// 	});
	// });
// }

// // if(false) {
// 	it('506.14.readMps() to the problem', function(done) {
// 		LpMps.read('test/mps/prob14.mps').then(function(p) {
// 			let g = p.solve();
// 			console.log(g.objVal);
// 			console.log(g.x.data);
// 			// assert(almost(g.objVal,3.23684211));
// 			// assert(g.x.almost([
// 			// 	2.5, 1.05, 0, 0.64285714, 0.5, 4, 0, 0.26315789 ]));
// 			done();
// 		});
// 	});
// }

});
