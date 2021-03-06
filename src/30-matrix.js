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
		    	console.log(209,this);
		    	console.log(210,d);
		    	console.trace('309,stack');;
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


