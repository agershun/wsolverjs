/*

   Copyright (c) Andrey Gershun (agershun@gmail.com), 2019

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
    	/** alasql main function */
        module.exports = factory();
    } else {
        root.wsolver = factory();
    }
}(this, function () {

const wsolver = function() {

};

wsolver.version = '0.0.1';


// Tolerance constant for almost()


const EPSILON = wsolver.EPSILON = 0.0000001;
const MAX_ITERATIONS = wsolver.MAX_ITERATIONS = 100000;

// TODO: Use compatible statuse
const PROBLEM_STATUS_INIT = wsolver.PROBLEM_STATUS_INIT = 1;
const PROBLEM_STATUS_SOLVED = wsolver.PROBLEM_STATUS_SOLVED = 2;
const PROBLEM_STATUS_INFEASIBLE = wsolver.PROBLEM_STATUS_INFEASIBLE = 3;

const LP_METHOD_BRUTE = wsolver.LP_METHOD_BRUTE = 1;
const LP_METHOD_INTPOINT = wsolver.LP_METHOD_INTPOINT = 2;
const LP_METHOD_SIMPLEX = wsolver.LP_METHOD_SIMPLEX = 3;

const DIR_MIN = wsolver.DIR_MIN = 1;
const DIR_MAX = wsolver.DIR_MAX = 2;

const STD_VAR_FR = wsolver.STD_VAR_FR = 0;
const STD_VAR_UP = wsolver.STD_VAR_UP = 1;
const STD_VAR_LO = wsolver.STD_VAR_LO = 2;
const STD_VAR_LO_UP = wsolver.STD_VAR_LO_UP = 3;
const STD_VAR_FX = wsolver.STD_VAR_FX = 4;

const STD_ROW_N = wsolver.STD_ROW_N = 5;
const STD_ROW_L = wsolver.STD_ROW_L = 6;
const STD_ROW_G = wsolver.STD_ROW_G = 7;
const STD_ROW_L_G = wsolver.STD_ROW_L_G = 8;
const STD_ROW_E = wsolver.STD_ROW_E = 9;

// Vector library

class Vector {
	constructor(size) {
		this.size = size;
		this.data = Array(size);
		return this;
	}

	static zeros(size) {
		const v = new Vector(size);
		v.data.fill(0.0);
		return v;
	}

	static ones(size) {
		const v = new Vector(size);
		v.data.fill(1.0);
		return v;
	}

	static init(data) {
		if(data instanceof Vector) {
			return data;
		}
		const v = new Vector(data.length);
		v.data = data;
		return v;
	}

	// a.dot(b)

	dot(b) {
		if(b instanceof Matrix) {
			if(this.size != b.rsize) {
				throw "not equal sizes of vector and matrix";
			}
			let v = Vector.zeros(b.csize);
			for(let i=0;i<this.size;i++) {
				for(let j=0;j<b.csize;j++) {
					v.data[j] += this.data[i]*b.data[i][j];
				}
			}
			return v;
		} else if(b instanceof Vector) {
			let res = 0;
			for(let i=0;i<this.size;i++) {
				res += this.data[i]*b.data[i];
			}
			return res;			
		} else if (typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] *= b;
			}
			return r;
		} else {
			console.log(58,this,b);
			throw 'Vector.dot(): wrong type of second operand';
		}
	}	

	clone() {
		const v = new Vector(this.size);
		v.data = this.data.slice();
		return v;
	}

	cloneData() {
		return this.data.slice();
	}

	almost(b) {
    	if(typeof b == 'object' && b instanceof Array) {
    		b = Vector.init(b);
    	}
    	if(this.size != b.size) {
    		throw 'Size is different';
    	}
    	let res = true;
    	for(let i=0;i<this.size;i++) {
    		if(!almost(this.data[i],b.data[i])) {
    			res = false;
    			break;
    		}
    	}
    	return res;		
	}

	add(b) {
		if(b instanceof Vector) {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] += b.data[i];
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] += b;
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	sub(b) {
		if(b instanceof Vector) {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] -= b.data[i];
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] -= b;
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	mul(b) {
		if(b instanceof Vector) {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] *= b.data[i];
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] *= b;
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	div(b) {
		if(b instanceof Vector) {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] /= b.data[i];
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] /= b;
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	copyFrom(v,start) {
		for(let i=0;i<v.size;i++) {
			this.data[start+i] = v.data[i];
		}
	}

	neg() {
		let v = new Vector(this.size);
		for(let i=0;i<this.size;i++) {
			v.data[i] = -this.data[i];
		}
		return v;
	}

	slice(start,finish) {
		if(typeof finish == 'undefined') {
			finish = this.size;
		}
		let v = new Vector(finish-start);
		v.data = this.data.slice(start,finish);
		return v;
	}

	diag() {
		let m = Matrix.zeros(this.size,this.size);
		for(let i=0;i<this.size;i++) {
			m.data[i][i] = this.data[i];
		}
		return m;
	}

	selectVals(indices) {
		let v = new Vector(indices.length);
		for(let i=0;i<indices.length;i++) {
			v.data[i] = this.data[indices[i]];
		}
		//v.data = indices.map(idx=>this.data[idx]);
		return v;
	}

}

wsolver.Vector = Vector;

// Vector library

class Matrix {

	constructor(rsize,csize) {
		this.rsize = rsize;
		this.csize = csize;
		this.data = Array(rsize);
		for(let i=0;i<rsize;i++){
			this.data[i] = Array(csize);
		}
		return this;
	}

	clone() {
		const m = new Matrix(this.rsize,this.csize);
		m.data = this.cloneData();
		return m;
	}

	cloneData() {
		const data = new Array(this.rsize);
		for(let i=0;i<this.rsize;i++){
			data[i] = this.data[i].slice();
		}
		return data;
	}


	static zeros(rsize,csize) {
		const m = new Matrix(rsize,csize);
		for(let i=0;i<rsize;i++){
			m.data[i].fill(0.0);
		}
		return m;
	}

	static ones(rsize,csize) {
		const m = new Matrix(rsize,csize);
		for(let i=0;i<rsize;i++){
			m.data[i].fill(1.0);
		}
		return m;
	}


	static init(data) {
		if(data instanceof Matrix) {
			return data;
		}
		const m = new Matrix(data.length,data[0].length);
		m.data = data;
		return m;
	}

	trans() {
		const m = new Matrix(this.csize,this.rsize);
		for(let i=0;i<this.rsize;i++){
			for(let j=0;j<this.csize;j++) {
				m.data[j][i] = this.data[i][j];	
			}
		}
		return m;
	}

	// SImirar to A[:,rows] in Python

	selectRows(rows) {
		let M = new Matrix(rows.length, this.csize);
		for(let i=0;i<rows.length;i++) {
			for(let j=0;j<this.csize;j++) {
				M.data[i][j] = this.data[rows[i]][j];
			}
		}
		return M;
	}

	selectCols(cols) {
		let M = new Matrix(this.rsize,cols.length);
		for(let i=0;i<this.rsize;i++) {
			for(let j=0;j<cols.length;j++) {
				M.data[i][j] = this.data[i][cols[j]];
			}
		}
		return M;
	}


/*
	// function for finding rank of matrix
	// Based on https://www.geeksforgeeks.org/program-for-rank-of-matrix/
	// 
	rank2() {
		let m = this.clone();
    	let rank = m.csize; 
  
    	for (let row = 0; row < rank; row++)  { 
    		if(row >= m.rsize) break;

  	        if (!utils.eq(m.data[row][row],0.0)) { 
	           for (let col = 0; col < m.rsize; col++) { 
	               if (col != row) { 
	                 	let mult = m.data[col][row] / m.data[row][row]; 
	                 	// let mult = m.data[row][col] / m.data[row][row]; 
	                 	for (let i = 0; i < rank; i++) {
	                 		m.data[col][i] -= mult * m.data[row][i]; 
	                 	}
	              	} 
	           }
	        } else {
	            let reduce = true; 
	            for (let i = row + 1; i < m.rsize;  i++) {
	                if (!utils.eq(m.data[i][row],0.0)) {
	                	let tmp = m.data[i];
	                	m.data[i] = m.data[rank];
	                	m.data[rank] = m.data[i];
	                    reduce = false; 
	                    break; 
	                } 
	            } 
	  
	            if (reduce) { 
	                rank--; 
	                for (let i = 0; i < m.rsize; i++) {
	                    m.data[i][row] = m.data[i][rank]; 
	                }
	            } 
	            row--; 
	        } 
	        console.log(125,rank);
	    } 
    	return rank; 
    }
*/
    // Matrix rank
    // Source: https://cp-algorithms.com/linear_algebra/rank-matrix.html

    rank() {
    	let A = this.clone();
    	let rank = 0;
    	let selected = new Array(A.rsize);
    	selected.fill(false);

    	for(let i=0; i<A.csize;i++) {
    		let j;
    		for(j=0;j<A.rsize;j++) {
    			if(!selected[j] && !almost(A.data[j][i],0)) {
    				break;
    			}
    		}

    		if(j != A.rsize) {
    			rank++;
    			selected[j]=true;
    			for(let p=i+1;p<A.csize;p++) {
    				A.data[j][p] /= A.data[j][i];
    			}
    			for(let k=0;k<A.rsize;k++) {
    				if (k != j && !almost(A.data[k][i],0)) {
    					for(let p = i+1; p<A.csize;p++) {
    						A.data[k][p] -= A.data[j][p]*A.data[k][i];
    					}
    				}
    			}
    		}
    	}
    	return rank;
    }


	rref() {
		let m = this.clone();
		m.pivots = [];

		let lead = 0;

		for(let k=0; k<m.rsize; k++) {
			if(lead >= m.csize) {
				return m;
			}
			let i = k;
			while(m.data[i][lead] == 0.0) {
				i++;
				if(i == m.rsize) {
					i = k;
					lead++;
					if(lead == m.csize) {
						return m;
					}
				}
			}
			m.pivots.push(k);
			// Swap rows
			if(i != k) {
				let tmp = m.data[i];
				m.data[i] = m.data[k];
				m.data[k] = tmp;
			}

	        let val = m.data[k][lead];
	        if(val != 0.0) {
		        for (let j = 0; j < m.csize; j++) {
		            m.data[k][j] /= val;
		        }
		   	}
	 
	        for (let i = 0; i < m.rsize; i++) {
	            if (k == i) continue;
	            val = m.data[i][lead];
	            for (let j = 0; j < m.csize; j++) {
	                m.data[i][j] -= val * m.data[k][j];
	            }
	        }
	        lead++;
	    }
		return m;
	}

	// TODO rewrite

	inv() {
	    if(this.csize !== this.csize){
	    	throw "The number of rows and columns should be equal for matrix inversion";
	    }
	    let i=0, ii=0, j=0, dim=this.csize, e=0, t=0;
	    let I = [], C = [];
	    for(i=0; i<dim; i+=1){
	        // Create the row
	        I[I.length]=[];
	        C[C.length]=[];
	        for(j=0; j<dim; j+=1){
	            if(i==j){ I[i][j] = 1; }
	            else{ I[i][j] = 0; }
	            C[i][j] = this.data[i][j];
	        }
	    }
	    
	    // Perform elementary row operations
	    for(i=0; i<dim; i+=1){
	        // get the element e on the diagonal
	        e = C[i][i];
	        
	        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
	        if(e==0){
	            //look through every row below the i'th row
	            for(ii=i+1; ii<dim; ii+=1){
	                //if the ii'th row has a non-0 in the i'th col
	                if(C[ii][i] != 0){
	                    //it would make the diagonal have a non-0 so swap it
	                    for(j=0; j<dim; j++){
	                        e = C[i][j];       //temp store i'th row
	                        C[i][j] = C[ii][j];//replace i'th row by ii'th
	                        C[ii][j] = e;      //repace ii'th by temp
	                        e = I[i][j];       //temp store i'th row
	                        I[i][j] = I[ii][j];//replace i'th row by ii'th
	                        I[ii][j] = e;      //repace ii'th by temp
	                    }
	                    //don't bother checking other rows since we've swapped
	                    break;
	                }
	            }
	            //get the new diagonal
	            e = C[i][i];
	            //if it's still 0, not invertable (error)
	            if(e==0){return}
	        }
	        
	        // Scale this row down by e (so we have a 1 on the diagonal)
	        for(j=0; j<dim; j++){
	            C[i][j] = C[i][j]/e; //apply to original matrix
	            I[i][j] = I[i][j]/e; //apply to identity
	        }
	        
	        // Subtract this row (scaled appropriately for each row) from ALL of
	        // the other rows so that there will be 0's in this column in the
	        // rows above and below this one
	        for(ii=0; ii<dim; ii++){
	            // Only apply to other rows (we want a 1 on the diagonal)
	            if(ii==i){continue;}
	            
	            // We want to change this element to 0
	            e = C[ii][i];
	            
	            // Subtract (the row above(or below) scaled by e) from (the
	            // current row) but start at the i'th column and assume all the
	            // stuff left of diagonal is 0 (which it should be if we made this
	            // algorithm correctly)
	            for(j=0; j<dim; j++){
	                C[ii][j] -= e*C[i][j]; //apply to original matrix
	                I[ii][j] -= e*I[i][j]; //apply to identity
	            }
	        }
	    }
	    
	    //we've done all operations, C should be the identity
	    //matrix I should be the inverse:
	    let m = new Matrix(this.csize,this.rsize);
	    m.data = I;

	    return m;

	}

	// Matrix multiplication

	dot(d) {
		if(d instanceof Vector) {
		    if(this.csize != d.size){ 
		    	throw "Matrix.dot(Vector): Matrix number of rows is not equal to vector size";
		    }
		    const r = Vector.zeros(this.rsize);
	        for(var i=0; i<this.rsize; i++){
	            for(var m=0; m<this.csize; m++){
	                r.data[i] += this.data[i][m] * d.data[m];                      
	            }
	        }
		    return r;
    	} else if (d instanceof Matrix) {
		    if(this.csize != d.rsize){ 
		    	throw "Matrix.dot(Matrix): Number of rows of the first matrix is not equal to the number of columns of the second matrix";
		    }

		    const r = Matrix.zeros(this.rsize,d.csize);
		    for(let i=0;i<this.rsize;i++) {
		    	for(let j=0;j<this.csize;j++) {
			    	for(let k=0;k<d.csize;k++) {
			    		r.data[i][k] += this.data[i][j]*d.data[j][k];
			    	}
			    } 
		    }
		    return r;
    	} else if (typeof d == 'number') {
    		const r = this.clone();
    		for(let i=0;i<this.rsize;i++) {
    			for(let j=0;j<this.csize;j++) {
    				r.data[i][j] *= d;
    			}
    		}
    		return r;
    	} else {
    		throw 'Error'
    	}
    }

    // About

    almost(B) {
    	let res = true;
    	if(this.csize != B.csize) res = false;
    	if(this.rsize != B.rsize) res = false;
    	for(let i=0;i<this.rsize;i++) {
    		for(let j=0;j<this.csize;j++) {
    			if(!almost(this.data[i][j],B.data[i][j])) res = false;
    		}
    	}
    	return res;
    }

	add(b) {
		if(b instanceof Matrix) {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] += b.data[i][j];
				}
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] += b;
				}
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	sub(b) {
		if(b instanceof Matrix) {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] -= b.data[i][j];
				}
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] -= b;
				}
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	mul(b) {
		if(b instanceof Matrix) {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] *= b.data[i][j];
				}
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] *= b;
				}
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	div(b) {
		if(b instanceof Matrix) {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] /= b.data[i][j];
				}
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] /= b;
				}
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}




	copyFrom(m,srow, scol) {
		for(let i=0;i<m.rsize;i++) {
			for(let j=0;j<m.csize;j++) {
				this.data[srow+i][scol+j] = m.data[i][j];
			}
		}
	}

	neg() {
		let m = new Matrix(this.rsize,this.csize);
		for(let i=0;i<this.rsize;i++) {
			for(let j=0;j<this.csize;j++) {
				m.data[i][j] = -this.data[i][j];
			}
		}
		return m;
	}

	slice(rstart,cstart,rfinish,cfinish) {
		if(typeof rfinish == 'undefined') {
			rfinish = this.rsize;
		}
		if(typeof cfinish == 'undefined') {
			cfinish = this.csize;
		}
		let m = new Matrix(rfinish-rstart,cfinish-cstart);
		for(let i=0;i<rfinish-rstart;i++) {
			m.data[i] = this.data[rstart+i].slice(cstart,cfinish);
		}
		return m;
	}

	static eye(size) {
		let m = Matrix.zeros(size,size);
		for(let i=0;i<size;i++) {
			m.data[i][i] = 1;
		}
		return m;
	}

	selectRow(idx) {
		const v = new Vector(this.csize);
		v.data = this.data[idx];
		return v;
	}

	selectCol(idx) {
		const v = new Vector(this.rsize);
		for(let i=0;i<this.rsize;i++) {
			v.data[i] = this.data[i][idx];
		}		
		return v;
	}

	toString() {
		let s = '';
		for(let i=0;i<this.rsize;i++) {
			s += this.data[i].join(', ')+'\n';
		}
		return s;
	}


}	

wsolver.Matrix = Matrix;

wsolver.solveLeqGauss = function solveLeqGauss(a,b) {

	// Prepare matrix for Gauss mathod

	let A = new Matrix(a.rsize, a.csize+1);
	A.copyFrom(a,0,0);

	for(let i=0;i<A.rsize;i++) {
		A.data[i][a.csize] = b.data[i];
	}

	// Solve
    let unfeasible = false;

    for (var i=0; i<A.rsize; i++) {
        // Search for maximum in this column
        var maxEl = Math.abs(A.data[i][i]);
        var maxRow = i;
        for(var k=i+1; k<A.rsize; k++) {
            if (Math.abs(A.data[k][i]) > maxEl) {
                maxEl = Math.abs(A.data[k][i]);
                maxRow = k;
            }
        }

        // Swap maximum row with current row (column by column)
        for (var k=i; k<A.rsize+1; k++) {
            var tmp = A.data[maxRow][k];
            A.data[maxRow][k] = A.data[i][k];
            A.data[i][k] = tmp;
        }

        // Make all rows below this one 0 in current column
        for (k=i+1; k<A.rsize; k++) {
            if(A.data[i][i] == 0) {
                unfeasible = true;
                break;
            }
            var c = -A.data[k][i]/A.data[i][i];
            for(var j=i; j<A.rsize+1; j++) {
                if (i==j) {
                    A.data[k][j] = 0;
                } else {
                    A.data[k][j] += c * A.data[i][j];
                }
            }
        }
        if(unfeasible) break;
    }

    if(unfeasible) return -1;

    // Solve equation Ax=b for an upper triangular matrix A
    var x = new Vector(A.rsize);
    for (var i=A.rsize-1; i>-1; i--) {
        x.data[i] = A.data[i][A.rsize]/A.data[i][i];
        for (var k=i-1; k>-1; k--) {
            A.data[k][A.rsize] -= A.data[k][i] * x.data[i];
        }
    }
    return x;
}

wsolver.solveLpBrute = function solveLpBrute(c,A,b,opt) {
	// Prepare data
	c = Vector.init(c);
	A = Matrix.init(A);
	b = Vector.init(b);

	// console.log(7,A.rank(),A.trans().rref().pivots);

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		// console.log(10);
		A = A.selectRows(A.trans().rref().pivots);
	}

	// console.log(13,A);

	let csize = A.csize;
	let rsize = A.rsize;

	let optVal = Infinity;
	let optBasis;
	let optX_b;
	let iteration = 0;

// console.log(24,A.csize, A.rsize);
// console.log(25,utils.range(A.csize));
// console.log(26,utils.combinations(utils.range(A.csize),A.rsize);

	for(let basicIndices of utils.combinations(utils.range(A.csize),A.rsize)) {
// console.log(25,iteration,basicIndices);
		iteration++;
		let B = A.selectCols(basicIndices);
		if(B.rank()!=rsize) continue;

		let x_b = B.inv().dot(b);


		if(x_b.data.some(x=>x<0)) continue;
		// let obj = c.dot(x_b);
		// console.log(30,iteration,obj);
		// console.log(31,c,x_b);

		let obj = 0;
		for(let i=0;i<x_b.size;i++) {
			obj += c.data[basicIndices[i]]*x_b.data[i];
		}
		if(obj<optVal) {
			optVal = obj;
			optBasis = basicIndices;
			optX_b = x_b;
		}
	}

	if(!optBasis) return -1;

	let x = Vector.zeros(csize);

	for(let i=0;i<x.size;i++) {
		if(optBasis.includes(i)) {
			x.data[i] = optX_b.data[optBasis.indexOf(i)];
		}
	}
	return x;
}


wsolver.solveLpIntPoint = function solveLpIntPoint(c,A,b,opt) {
	// Prepare data
	c = Vector.init(c);
	A = Matrix.init(A);
	b = Vector.init(b);

	if(A.csize != c.size) {
		throw "The first dimension of A and c must match.";
	}
	if(A.rsize != b.size) {
		throw "The second dimension of A and b must match.";
	}

	if(!opt) opt = {};
	if(!opt.MAX_ITERATIONS) opt.MAX_ITERATIONS = wsolver.MAX_ITERATIONS;
	if(!opt.EPSILON) opt.EPSILON = wsolver.EPSILON;

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		A = A.selectRows(A.trans().rref().pivots);
	}

	let rsize = A.rsize;
	let csize = A.csize;

	let x = Vector.ones(csize);
	let l = Vector.ones(rsize);
	let s = Vector.ones(csize);

	let iteration = 0;

	while(Math.abs(x.dot(s))>opt.EPSILON) {
		iteration++;
		if(iteration > opt.MAX_ITERATIONS) break;
		// if(iteration > 2) break;

		let primalObj = c.dot(x);
		let dualObj = b.dot(l);

		// console.log(39, iteration, x.dot(s), primalObj,dualObj)

		let sigma = 0.4;
		let mu = x.dot(s)/csize;

		let A_ = Matrix.zeros(rsize+csize*2, rsize+csize*2);

		// Create tableau
		A_.copyFrom(A,0,0);
		A_.copyFrom(A.trans(),rsize,csize);
		A_.copyFrom(Matrix.eye(csize),rsize,csize+rsize);
		A_.copyFrom(s.diag(),rsize+csize,0);
		A_.copyFrom(x.diag(),rsize+csize,rsize+csize);


// console.log(A_.data.map(x=>x.join(',')).join('\n'));
		// for(let i=0;i<rsize;i++) {
		// 	for(let j=0;j<csize;j++) {
		// 		A_.data[i][j] = A.data[i][j];
		// 	}
		// }

		// TODO - make a copy of matrix into the matrix
		// let AT = A.trans();
		// for(let i=0;i<csize;i++) {
		// 	for(let j=0;j<rsize;j++) {
		// 		A_.data[m+i][n+j] = AT.data[i][j];
		// 	}
		// }


		// for(let i=0;i<csize;i++) {
		// 	A_.data[rsize+i][rsize+csize+i] = 1.0;
		// 	A_.data[rsize+csize+i][i] = s.data[i];
		// 	A_.data[rsize+csize+i][rsize+csize+i] = x.data[i];
		// }

		let b_ = new Vector(rsize+2*csize);
		b_.copyFrom(b.sub(A.dot(x)),0);
		b_.copyFrom(c.sub(A.trans().dot(l)).sub(s),rsize);
		b_.copyFrom(x.diag().dot(s.diag()).dot(Vector.ones(csize)).add(-sigma*mu).neg(),rsize+csize);
		
// console.log(79,Matrix.ones(csize,csize));
// console.log(80,x.diag().dot(s.diag()).dot(Matrix.ones(csize,csize)).add(-sigma*mu).neg());
// console.log(81,x.diag().dot(s.diag()).dot(Matrix.ones(csize,csize)).add(-sigma*mu).neg())

// console.log(83,b_);

		let delta = wsolver.solveLeqGauss(A_,b_);
		// console.log(89,delta);

		if(delta == -1) {
			return -1; // Equation is unfeasible
		}

		let delta_x = delta.slice(0,csize);
		let delta_l = delta.slice(csize,csize+rsize);
		let delta_s = delta.slice(csize+rsize,csize+rsize+csize);

		let alphaMax = 1.0;
		for(let i=0;i<csize;i++) {
			if(delta_x.data[i] < 0) {
				alphaMax = Math.min(alphaMax, -x.data[i]/delta_x.data[i]);
			}
			if(delta_s.data[i] < 0) {
				alphaMax = Math.min(alphaMax, -s.data[i]/delta_s.data[i]);
			}
		}

		let eta = 0.99;
		let alpha = Math.min(1.0, eta * alphaMax);

		x = x.add(delta_x.mul(alpha));
		s = s.add(delta_s.mul(alpha));
		l = l.add(delta_l.mul(alpha));

	}

	return x;
}


wsolver.solveLpSimplex = function solveLpSimplex(c,A,b,opt) {
	// Prepare data
	c = Vector.init(c);
	A = Matrix.init(A);
	b = Vector.init(b);

	if(A.csize != c.size) {
		throw "The first dimension of A and c must match.";
	}
	if(A.rsize != b.size) {
		throw "The second dimension of A and b must match.";
	}

	if(!opt) opt = {};
	if(!opt.max_iterations) opt.max_iterations = wsolver.MAX_ITERATIONS;
	if(!opt.epsilon) opt.epsilon = wsolver.EPSILON;

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		A = A.selectRows(A.trans().rref().pivots);
	}

	let basic_indices = lpSimplexFirstPhase(A,b,opt);
	if(basic_indices == -1) return -1;

	return lpSimplexSecondPhase(c,A,b,basic_indices,opt);
}

function lpSimplexFirstPhase(A1,b1,opt,phase) {
	let rsize = A1.rsize;
	let csize = A1.csize;

	let A_positive = A1.clone();
	let b = b1.clone();

	for(let i=0;i<rsize;i++) {
		if(b.data[i]<0) {
			b.data[i] = -b.data[i];
			for(let j=0;j<csize;j++) {
				A_positive.data[i][j] = -A_positive.data[i][j];
			}
		}
	}

	let A_ = new Matrix(rsize,csize+rsize);
	A_.copyFrom(A_positive,0,0);
	A_.copyFrom(Matrix.eye(rsize),0,csize);

	let c = Vector.zeros(rsize+csize);
	for(let i=csize;i<csize+rsize;i++) {
		c.data[i] = 1;
	}

	let indices = [ ...Array(csize+rsize).keys() ];
	let basic_indices = indices.slice(csize,csize+rsize);
	let B = A_.selectCols(basic_indices);

	let optimal = false;
	let opt_infinity = false;
	let iteration = 0;
	let obj_val = Infinity;

	while (!optimal) {
		// console.log('iter', iteration, 'obj_val',obj_val);
		iteration++;

		let B_inv = B.inv();
		let x_b = B_inv.dot(b);

		if(x_b.data.every(x=>x==0)) {
			// TODO: Think about this message
			console.log('get_init_bfs_aux: alert! this bfs is degenerate');
		}

		let c_b = c.selectVals(basic_indices);

		obj_val = 0;
		for(let i=0; i<basic_indices.length;i++) {
			obj_val += c.data[basic_indices[i]] * x_b.data[i];
		}

		// TODO: Can be replaced with Map
		let reduced_costs = {};
		for(let j=0;j<indices.length;j++) {
			if(!basic_indices.includes(j)) {
				reduced_costs[j] = c.data[j] - c_b.dot(B_inv.dot(A_.selectCol(j)))
			}
		}

		if(Object.values(reduced_costs).every(x=>x>=0)) {	
			optimal = true;
			break;
		}

		let chosen_j;
		for(let j of Object.keys(reduced_costs)) {
			if(reduced_costs[j] < 0) {
				chosen_j = +j; // Convert to integer 
				break;
			}
		}

		let d_b = B_inv.dot(A_.selectCol(chosen_j)).neg();

		if(d_b.data.every(x=>x>=0)) {
			opt_infinity = true;
			break;
		}

		let l, theta_star;

		for(let i=0;i<basic_indices.length;i++) {
			if(d_b.data[i] < 0) {
				if (typeof l == 'undefined') {
					l = i;
				}
				if( -x_b.data[i]/d_b.data[i] < -x_b.data[l]/d_b.data[l]) {
					l = i;
					theta_star = -x_b.data[i]/d_b.data[i];
				}
			}
		}

		basic_indices[l] = chosen_j;
		basic_indices = basic_indices.sort();

		B = A_.selectCols(basic_indices);

	}

	if(obj_val != 0) {
		//console.log('The original problem is infeasible!');
		return -1;
	}

	let contains_artifical = false;

	for(let x of basic_indices) {
		if(x >= csize) {
			console.log(988,x,N);
			exit();
			contains_artifical = true;
			break;
		}
	}

	// console.log('NOT TESTED FROM HERE!')// TEST BELOW
	// console.log(1009,'contains_artifical',contains_artifical);
	// console.log(1010,'basic_indices',basic_indices);

	// TODO: Rewrite with matrix notation

	if(!contains_artifical) {
		if(basic_indices.length != rsize) {
			throw 'assertion failed, please check this';
		}
		if(B.rank() != rsize) {
			throw 'this should have been equal, assertion failed';
		}
		let x_b = B.inv().dot(b);
		if(!x_b.data.every(x=>x>=0)) {
			throw 'this does not give a feasible solution, something is wrong, assertion failed';
		}
		// console.log('init_bfs_aux: assertions passed, no artificial vars in basis by chance! found a valid init bfs in iterations',iteration);
		basic_indices = basic_indices.sort();
		return basic_indices;
	}

	let basic_indices_no_artificial = [];
	for(let index of basic_indices) {
		if(index < csize) {
			basic_indices_no_artificial.push(index);	
		}
	}

	let counter = 0;
	while(basic_indices_no_artificial.length < rsize) {
		if(basic_indices_no_artificial.includes(counter)) {
			continue;
		}

		let B_small = Array(A.length);
		for(let i = 0; i<A.length;i++) {
			B_small[i] = Array(basic_indices_no_artificial.length);
			for(let j=0;j<basic_indices_no_artificial.length;j++) {
				B_small[i][j] = A[i][basic_indices_no_artificial[j]];
			}
		}

		let B_test = Array(B_small.length);
		for(let i = 0; i<A.length;i++) {
			B_test[i] = Array(B_small[i].length+1);
			for(let j=0;j<B_small[i].length;j++) {
				B_test[i][j] = B_small[i][j];
			}
			B_test[i][B_small[i].length] = A[i][counter];
		}

		if(matrix_rank(B_test) == Math.min(B_test.length, B_test[0].length)) {
			basic_indices_no_artificial.push(counter);
		}

		counter++;
	}

	basic_indices = basic_indices_no_artificial.sort();

	B = Array(A.length);
	for(let i=0;i<A.length;i++) {
		B[i] = Array(basic_indices.length);
		for(let j=0;j<basic_indices;j++) {
			B[i][j] = A[i][basic_indices[j]];
		}
	}

	if(basic_indices.length == rsize) {
		throw 'assertion failed, please check this';
	}
	if(matrix_rank(B) == rsize) {
		throw 'this should have been equal, assertion failed';
	}
	x_b = B_inv.dot(b);
	if(x_b.data.every(x=>x>0)) {
		throw 'this does not give a feasible solution, something is wrong, assertion failed';
	}
	// console.log('init_bfs_aux: assertions passed, no artificial vars in basis by chance! found a valid init bfs in iterations',iteration_number);
	basic_indices = basic_indices.sort();
	return basic_indices;

}

function lpSimplexSecondPhase(c,A,b,basic_indices,opt) {
	let rsize = A.rsize;
	let csize = A.csize;

	let B = A.selectCols(basic_indices);
	let x_b;

	let optimal = false;
	let opt_infinity = false;
	let iteration = 0;
	let obj_val = Infinity;

	while (!optimal) {
		// console.log('iter', iteration, 'obj_val',obj_val);
		iteration++;

		let B_inv = B.inv();
		x_b = B_inv.dot(b);

		if(x_b.data.every(x=>x==0)) {
			// console.log('Alert! the bfs is degenerate');
		}

		let c_b = c.selectVals(basic_indices);

		obj_val = 0;
		for(let i=0; i<basic_indices.length;i++) {
			obj_val += c.data[basic_indices[i]] * x_b.data[i];
		}
// console.log(261);
		// TODO: Can be replaced with Map
		let reduced_costs = {};
		for(let j=0;j<csize;j++) {
			if(!basic_indices.includes(j)) {
				reduced_costs[j] = c.data[j] - c_b.dot(B_inv.dot(A.selectCol(j)))
			}
		}

// console.log(270,reduced_costs);
		if(Object.values(reduced_costs).every(x=>x>=0)) {	
			optimal = true;
			break;
		}
// console.log(274);
		let chosen_j;
		for(let j of Object.keys(reduced_costs)) {
			if(reduced_costs[j] < 0) {
				chosen_j = +j; // Convert to integer 
				break;
			}
		}

		let d_b = B_inv.dot(A.selectCol(chosen_j)).neg();
// console.log(284);
		if(d_b.data.every(x=>x>=0)) {
			opt_infinity = true;
			break;
		}

		let l, theta_star;

		for(let i=0;i<basic_indices.length;i++) {
			if(d_b.data[i] < 0) {
				if (typeof l == 'undefined') {
					l = i;
				}
				if( -x_b.data[i]/d_b.data[i] < -x_b.data[l]/d_b.data[l]) {
					l = i;
					theta_star = -x_b.data[i]/d_b.data[i];
				}
			}
		}	
		
		basic_indices[l] = chosen_j;
		basic_indices = basic_indices.sort();

		B = A.selectCols(basic_indices);

	}	
// console.log(311);
	if (opt_infinity) {
		// console.log('Optimal is inifinity');
		return -1;
	}

	if(!optimal) {
		// console.log('optimal not found');
		return -1;
	}

	let x = Vector.zeros(csize);

	for(let i=0;i< csize;i++) {
		if(basic_indices.includes(i)) {
			x.data[i] = x_b.data[basic_indices.indexOf(i)];
		}
	}
// console.log(329,x);
	return x;

}

class Problem {
	
// To be continued
}

wsolver.Problem = Problem;

/*
	Class to read and parse MPS files.
*/

class LpMps {
	
	static async read(filename) {
		let data;
		if (typeof exports === 'object') {
			const fs = require('fs');
			data = fs.readFileSync(filename, {encoding: 'utf-8'})
		} else {
			let response = await fetch(url);
			if (response.ok) { 
	  			data = await response.text();
			} else {
	  			throw "Problem.readMps(): Can't fetch file";
			}
		}

		let p = new LpMps();
		p.filename = filename;
		p.mps = data;
		p.rows = {};
		p.cols = {};
		p.goal = {};
		p.dir = DIR_MIN;
		p.parse();
		// p.prepare();
		return p;
	}

	parse() {
		let g = this;
		let lines = g.mps.split(/\n/g);
		let ptr = 0;
		let words, newSection;
		function next() {
			while(lines[ptr].substr(0,1) == '*' || lines[ptr].trim() == ''){
				ptr++;
			};
			words = lines[ptr].trimRight().split(/\s+/g);
			// console.log(words);
			newSection = words[0] != '';
			ptr++;
		}
		next();
		if(words[0] == 'NAME') {
			g.name = words[1];
			next();
		}

		if(words[0] == 'ROWS') {
			next();
			while(!newSection) {
				if(words[1] == 'N') {
					g.goal = {name:words[2],coeffs:{}};
				} else if(words[1] == 'L' ) {
					g.rows[words[2]] = {name:words[2],type:'L', coeffs:{}};
				} else if(words[1] == 'E' ) {
					g.rows[words[2]] = {name:words[2],type:'E',coeffs:{}};
				} else if(words[1] == 'G' ) {
					g.rows[words[2]] = {name:words[2],type:'G',coeffs:{}};
				} else {
					throw 'paresMps(): Wrong row type in ROWS section at line '+ptr;
				}
				next();
			}
		}
		if(words[0] == 'COLUMNS') {
			next();
			while(!newSection) {
				let col = g.cols[words[1]];
				if(typeof col == 'undefined') {
					col = g.cols[words[1]]= {name:words[1]};
				}

				if(words.length == 4) {
					if(words[2] == g.goal.name) {
						g.goal.coeffs[words[1]] = +words[3];
					} else {
						g.rows[words[2]].coeffs[words[1]] = +words[3];
					}
				} else if(words.length == 6) {
					if(words[2] == g.goal.name) {
						g.goal.coeffs[words[1]] = +words[3];
					} else {
						g.rows[words[2]].coeffs[words[1]] = +words[3];
					}

					if(words[4] == g.goal.name) {
						g.goal.coeffs[words[1]] = +words[5];
					} else {
						g.rows[words[4]].coeffs[words[1]] = +words[5];
					}
				} else {
					throw "parseMps(): Wrong number of arguments in COLUMNS section at line "+ptr;
				}
				next();
			}
		}

		if(words[0] == 'RHS') {
			next();
			while(!newSection) {
				if(words.length == 4 || words.length == 6) {
					g.rows[words[2]].rhs = +words[3];
					if(words.length == 6) {
						g.rows[words[4]].rhs = +words[5];
					}
				} else if(words.length == 6) {
					throw "parseMps(): Wrong number of arguments in RHS section at line "+ptr;
				}
				next();
			}
		}

		if(words[0] == 'RANGES') {
			next();
			while(!newSection) {
				if(words.length == 4) {
					g.rows[words[2]].range = +words[3];
				} else if(words.length == 6) {
					throw "parseMps(): Wrong number of arguments in RANGES section at line "+ptr;
				}
				next();
			}
		}


		if(words[0] == 'BOUNDS') {
			next();
			while(!newSection) {
				let v = g.cols[words[3]];
				if(typeof v == 'undefined') {
					v = g.vars[words[3]] = {name:words[3]};
				}
				if(words[1] == 'UP') {
					v.up = +words[4];
				} else if(words[1] == 'LO') {
					v.lo = +words[4];
				} else if(words[1] == 'FX') {
					v.lo = +words[4];
					v.hi = +words[4];
					// v.fixed = true;
				} else if(words[1] == 'FR') {
					// v.free = true;
				} else if(words[1] == 'MI') {
					v.hi = 0;
				} else if(words[1] == 'PL') {
					v.lo = 0;
				} else if(words[1] == 'UI') {
					v.hi = +words[4];
					v.int = true;
				} else if(words[1] == 'LI') {
					v.lo = +words[4];
					v.int = true;
				} else if(words[1] == 'BV') {
					v.lo = 0;
					v.lo = 1;
					v.binary = true;
				} else if(words[1] == 'SC') {
					// v.lo = +words[4];
				} else {
					throw "parseMps(): Wrong bound type at line "+ptr;
				}
				next();
			}
		}
		if(words[0] != 'ENDATA') {
			throw "parseMps(): Wrong section at line "+ptr;
		}
	}

	toGeneral() {
		let g = new LpGeneral();

		let cons = Object.keys(this.rows);
		let vars = Object.keys(this.cols);
		let rows = this.rows;
		let cols = this.cols;
		let rsize = cons.length;
		let csize = vars.length;
		g.c = Vector.zeros(csize);
		g.A = Matrix.zeros(rsize,csize);
		g.L = Array(rsize).fill(-Infinity);
		g.U = Array(rsize).fill(Infinity);
		g.l = Array(csize).fill(-Infinity);
		g.u = Array(csize).fill(Infinity);
		g.v = vars;
		g.n = cons;
		g.t = Array(csize).fill(undefined); // Integer (true/false)

		// Set the goal variable
		for(let j=0;j<csize;j++) {
			let vr = this.cols[vars[j]];
			let coeff = this.goal.coeffs[vars[j]];
			if(typeof coeff != 'undefined') {
				g.c.data[j] = coeff;
			}
			if(typeof vr.lo != 'undefined') {
				g.l[j] = vr.lo;
			}
			if(typeof vr.up != 'undefined') {
				g.u[j] = vr.up;
			}
			g.t[j] = (vr.binary || vr.int);
		}

		for(let i=0;i<rsize;i++) {
			let cn = rows[cons[i]];
			if(cn.type == 'E' ) {
				// g.L[i] = g.U[i] = cn.rhs||0;
				// console.log(223,cn.type);

				if(typeof cn.range != 'undefined') {
					// console.log(217,cn.range);
					if(cn.range >= 0) {
						g.L[i] = (cn.rhs||0);
						g.U[i] = (cn.rhs||0) + cn.range;
					} else {
						g.L[i] = (cn.rhs||0) + cn.range;
						g.U[i] = (cn.rhs||0);
					}
				} else {
					// console.log(218,cn.range,cn.rhs);
					g.L[i] = (cn.rhs||0);
					g.U[i] = (cn.rhs||0);		
				}
			} else if(cn.type == 'G') {
				g.L[i] = (cn.rhs||0) ;
				if(typeof cn.range != 'undefined') {
					g.U[i] = (cn.rhs||0) + Math.abs(cn.range||0);
				} else {
					g.U[i] = Infinity;
				}
			} else if(cn.type == 'L') {
				if(typeof cn.range != 'undefined') {
					g.L[i] = (cn.rhs||0) - Math.abs(cn.range||0);
				} else {
					g.L[i] = -Infinity;
				}
				g.U[i] = (cn.rhs||0) ;
			} else {
				throw 'Mps.toGeneral(): wrong contraint type';
			}
		// console.log(229, g.L[i],g.U[i],cn.name);			

		}

		// Set coefficients
		for(let i=0;i<rsize;i++) {
			let cn = rows[cons[i]];

			for(let j=0;j<csize;j++) {
				if(typeof cn.coeffs[vars[j]] != 'undefined') {
					g.A.data[i][j] = cn.coeffs[vars[j]];
				}
			}
		}

		return g;
	}

}

wsolver.LpMps = LpMps;



class LpProblem extends Problem {
}

wsolver.LpProblem = LpProblem;
class LpGeneral {
	toStandard() {
		let g = this;
		let u = g.u, l=g.l, U=g.U, L=g.L;
		let csize = g.A.csize, rsize = g.A.rsize;
		let s = new LpStandard();


// console.log(g);
		// Phase 1 - calculate number of variables, slacks and rows
		let vn = 0, sn = 0, rn = 0; // variables, slacks, rows
		let xv = this.xv = Array(csize);
		let xr = Array(rsize);

		for(let j=0;j<csize;j++) {
			if(l[j] == -Infinity && u[j] == Infinity) {
				xv[j] = {type:STD_VAR_FR, vn:vn};
				vn+=2;
			} else if(l[j] == -Infinity && u[j] < Infinity) {
				xv[j] = {type:STD_VAR_UP, vn:vn};
				vn++;
			} else if(l[j] > -Infinity && u[j] == Infinity) {
				xv[j] = {type:STD_VAR_LO, vn:vn};
				vn++;
			} else if(l[j] > -Infinity && u[j] < Infinity) {
				if(l[j] != u[j]) {
					xv[j] = {type:STD_VAR_LO_UP, vn:vn, sn:sn};
					vn++;
					rn++;
					sn++;
				} else {
					xv[j] = {type:STD_VAR_FX};
				}
			}
		}

		for(let i=0; i<rsize; i++) {
			if(L[i] == -Infinity && U[i] == Infinity) {
				xr[i] = {type:STD_ROW_N};
			} else if(L[i] == -Infinity && U[i] < Infinity) {
				xr[i] = {type:STD_ROW_L,sn:sn};
				rn++;
				sn++;
			} else if(L[i] > -Infinity && U[i] == Infinity) {
				xr[i] = {type:STD_ROW_G,sn:sn};
				rn++;
				sn++;
			} else if(L[i] > -Infinity && U[i] < Infinity) {
				if(L[i] != U[i]) {
// console.log(50,'STD_ROW_L_G',L[i],U[i])
					xr[i] = {type:STD_ROW_L_G,sn:sn};
					rn+=2;
					sn+=2;
				} else {
					xr[i] = {type:STD_ROW_E};
					rn++;
				}
			} else {
				throw 'Impossible error';
			}

		}

		// Phase 2
		let A = s.A = Matrix.zeros(rn,vn+sn);
		let b = s.b = Vector.zeros(rn);
		let c = s.c = Vector.zeros(vn+sn);
		let rm = 0;
		g.slack = 0;

		// Loop over variables
		// Calculate slacks and add equalities for double-sided virables
		for(let j=0;j<csize;j++) {
			switch(xv[j].type) {
				case STD_VAR_FR: 
					c.data[xv[j].vn] = g.c.data[j];
					c.data[xv[j].vn+1] = -g.c.data[j];
					break;				
				case STD_VAR_UP: 			
					c.data[xv[j].vn] = -g.c.data[j];
					// g.slack += u[j]*g.c.data[j];
					// console.log(79,u[j]*g.c.data[j]);
					break;				
				case STD_VAR_LO: 
					c.data[xv[j].vn] = g.c.data[j];
					// g.slack += -l[j]*g.c.data[j];
					// console.log(85,-l[j]*g.c.data[j]);
					break;				
				case STD_VAR_LO_UP: 
					c.data[xv[j].vn] = g.c.data[j];
					// g.slack += -l[j]*g.c.data[j];

					A.data[rm][xv[j].vn] = 1;
					A.data[rm][vn+xv[j].sn] = 1;
					b.data[rm] = (u[j]-l[j]);
					rm++;
					break;
				case STD_VAR_FX:
					// g.slack += -l[j]*g.c.data[j];
					// console.log(89,-l[j]*g.c.data[j]);
					break;				
			}
		}

//console.log(100,g.slack);
// console.log(106,s.c.data);
// console.log(107,A.toString());
// console.log(108,s.b.data);

		for(let i=0;i<rsize;i++) {
			let slack = 0;
			switch(xr[i].type) {
				case STD_ROW_N:
					// skip
					break;				
				case STD_ROW_L:
					// Copy line
					// console.log(93,i,xr[i]);
					for(let j=0;j<csize;j++) {
						switch(xv[j].type) {
							case STD_VAR_FR: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];			
								A.data[rm][xv[j].vn+1] = -g.A.data[i][j];			
								break;
							case STD_VAR_UP: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								slack += -u[j]*g.A.data[i][j];
								console.log(103,i,j,l[j],u[j],slack);
								break;				
							case STD_VAR_LO: 				
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								console.log(108,i,j,l[j],u[j])
								break;				
							case STD_VAR_LO_UP: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								console.log(117,i,j,l[j],u[j],slack)
								break;
							case STD_VAR_FX: 
								slack += l[j]*g.A.data[i][j];
								console.log(112,i,j,l[j],u[j])
								break;
						}
					}
					A.data[rm][vn+xr[i].sn] = 1;
					b.data[rm] = U[i] + slack;
					rm++;
					break;				
				case STD_ROW_G:
					// Copy line
					for(let j=0;j<csize;j++) {
						switch(xv[j].type) {
							case STD_VAR_FR: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];			
								A.data[rm][xv[j].vn+1] = g.A.data[i][j];			
								break;
							case STD_VAR_UP: 
								A.data[rm][xv[j].vn] = +g.A.data[i][j];
								slack += u[j]*g.c.data[j];
								console.log(136,i,j,l[j],u[j])
								break;				
							case STD_VAR_LO: 				
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								slack += -l[j]*g.c.data[j];
								console.log(141,i,j,l[j],u[j])
								break;				
							case STD_VAR_LO_UP: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								slack += -l[j]*g.A.data[i][j];
								console.log(150,i,j,l[j],u[j],xv[j]);								
								break;
							case STD_VAR_FX: 
								slack += -l[j]*g.c.data[j];
								console.log(145,i,j,l[j],u[j])
								break;
						}
					}				
					A.data[rm][vn+xr[i].sn] = 1;
					console.log(155,L[i],U[i],slack);
					b.data[rm] = -L[i] + slack;
					rm++;
					break;				
				case STD_ROW_E:
					for(let j=0;j<csize;j++) {
						switch(xv[j].type) {
							case STD_VAR_FR: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];			
								A.data[rm][xv[j].vn+1] = -g.A.data[i][j];			
								break;
							case STD_VAR_UP: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								slack += u[j]*g.A.data[i][j];
								console.log(169,i,j,l[j],u[j]);
								break;				
							case STD_VAR_LO: 				
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								slack += -l[j]*g.A.data[i][j];
								console.log(174,i,j,l[j],u[j]);
								break;				
							case STD_VAR_LO_UP: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								slack += -l[j]*g.A.data[i][j];
								console.log(183,i,j,l[j],u[j],slack);
								break;
							case STD_VAR_FX: 
								slack += -l[j]*g.A.data[i][j];
								console.log(178,i,j,l[j],u[j]);
								break;
						}
					}
					b.data[rm] = U[i] + slack;
					rm++;					
					break;
				case STD_ROW_L_G:
					// Two lines
					for(let j=0;j<csize;j++) {
						switch(xv[j].type) {
							case STD_VAR_FR: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];			
								A.data[rm][xv[j].vn+1] = -g.A.data[i][j];			
								A.data[rm+1][xv[j].vn] = -g.A.data[i][j];			
								A.data[rm+1][xv[j].vn+1] = g.A.data[i][j];			
								break;
							case STD_VAR_UP: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								A.data[rm+1][xv[j].vn] = -g.A.data[i][j];
								slack += u[j]*g.c.data[j];
								break;				
							case STD_VAR_LO: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								A.data[rm+1][xv[j].vn] = g.A.data[i][j];
								slack += -l[j]*g.c.data[j];
								break;				
							case STD_VAR_LO_UP: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								A.data[rm+1][xv[j].vn] = g.A.data[i][j];
								slack += -l[j]*g.c.data[j];
								break;
							case STD_VAR_FX: 
								slack += -l[j]*g.c.data[j];
								break;
						}
					}
					A.data[rm][vn+xr[i].sn] = 1;
					A.data[rm+1][vn+xr[i].sn+1] = 1;
					b.data[rm] = U[i] + slack;
					b.data[rm+1] = -(L[i] + slack);
					rm+=2;
					break;
			}
		}

		return s;

	}

	fromStandard(s) {
		let csize = this.A.csize;
		let xv = this.xv;
		this.x = Vector.zeros(csize);
		for(let j=0;j<csize;j++) {
			let type = xv[j].type;
			if(type==STD_VAR_FR) {
				this.x.data[j] = s.x.data[xv[j].vn] - s.x.data[xv[j].vn+1];
			} else if(type==STD_VAR_UP) {
				this.x.data[j] = -s.x.data[xv[j].vn]+this.u[j];
			} else if(type==STD_VAR_LO) {
				this.x.data[j] = s.x.data[xv[j].vn]+this.l[j];
			} else if(type==STD_VAR_LO_UP) {
				this.x.data[j] = s.x.data[xv[j].vn]+this.l[j];
			} else if(type==STD_VAR_FX) {
				this.x.data[j] = this.l[j];
			}
		}
		// console.log(270,s.x.data);
		// console.log(271,this.c.data,this.x.data);
		this.objVal = this.c.dot(this.x);
		// console.log(272,this.objVal);
	}

}

wsolver.LpGeneral = LpGeneral;
class LpStandard {
	static init(c,a,b,opt) {
		let p = new LpStandard();
		p.c = Vector.init(c);
		p.A = Matrix.init(a);
		p.b = Vector.init(b);
		p.status = wsolver.PROBLEM_STATUS_INIT;
		p.method = LP_METHOD_INTPOINT;
		return p;
	}

	solve() {
		if(!this.method) this.method = LP_METHOD_BRUTE;
		switch(this.method) {
			case LP_METHOD_BRUTE: 
				this.x = wsolver.solveLpBrute(this.c,this.A,this.b); 
				// console.log(17,this.x);
				break;
			case LP_METHOD_INTPOINT: 
				this.x = wsolver.solveLpIntPoint(this.c,this.A,this.b); 
				break;
			case LP_METHOD_SIMPLEX: 
				this.x = wsolver.solveLpSimplex(this.c,this.A,this.b); 
				break;
		}
		if(this.x == -1) {
			this.status = wsolver.PROBLEM_STATUS_INFEASIBLE;
			return;
		} else {
			this.status = wsolver.PROBLEM_STATUS_SOLVED;
			this.optVal = this.c.dot(this.x);
			return;
		}
	}

}

wsolver.LpStandard = LpStandard;
class utils {
	//
	// Generate array of numbers from 0 to size-1
	//
	static range(size) {
		return [ ...Array(size).keys() ];
	}

	static *combinations(pool, r) {
		const n = pool.length;
		if (r > n) {
			return;
		}

	  	let indices = utils.range(r);
	  
	  	function ret() {
	    	let ret = [];
	    	for (let i=0; i < indices.length; i++) {
	      		ret.push(pool[indices[i]])
	    	}
	    	return ret;
	  	}
	  
	  	yield ret();
	  
	  	while (true) {
	    	let broken = false;
	    	let i = r-1;
	    	for (; i >= 0; i--) {
	      		if (indices[i] != i + n - r) {
	        		broken = true;
	        		break;
	      		}
	    	}
		    if (!broken) {
				return;
		    }
	    	indices[i]++;
	    	for (let j=i+1; j < r; j++) {
	      		indices[j] = indices[j-1] + 1;
	    	}
	    	yield ret();
	  	}
	}

	static almost(a,b) {
		return Math.abs(a-b)<wsolver.EPSILON;
	}

}

const almost = wsolver.almost = utils.almost;
wsolver.utils = utils;


return wsolver;

}));