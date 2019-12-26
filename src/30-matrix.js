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

	selectRows(rows){
		let a = new Matrix(rows.length, this.csize);
		for(let i=0;i<rows.length;i++) {
			for(let j=0;j<this.csize;j++) {
				a.data[i][j] = this.data[rows[i]][j];
			}
		}
		return a;
	}

	rref() {
		return new RrefMatrix(this);
	}

	// function for finding rank of matrix
	// Based on https://www.geeksforgeeks.org/program-for-rank-of-matrix/
	// 
	rank() {
		let m = this.clone();
    	let rank = m.csize; 
  
    	for (let row = 0; row < rank; row++)  { 
	        if (m.data[row][row] != 0.0) { 
	           for (let col = 0; col < m.rsize; col++) { 
	               if (col != row) { 
	                 	let mult = m.data[col][row] / m.data[row][row]; 
	                 	for (let i = 0; i < rank; i++) {
	                 		m.data[col][i] -= mult * m.data[row][i]; 
	                 	}
	              	} 
	           }
	        } else {
	            let reduce = true; 
	            for (let i = row + 1; i < m.rsize;  i++) {
	                if (m.data[i][row] != 0) {
	                	let tmp = m.data[i];
	                	m.data[i] = m.data[rank];
	                	m.data[rank] = m.data[i];
	                    reduce = false; 
	                    break; 
	                } 
	            } 
	  
	            if (reduce) { 
	                rank--; 
	                for (let i = 0; i < m.rsize; i ++) {
	                    m.data[i][row] = m.data[i][rank]; 
	                }
	            } 
	            row--; 
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

	invert() {
	    if(this.csize !== this.csize){
	    	// assert
	    	return;
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
	            C[i][j] = M[i][j];
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

}

wsolver.Matrix = Matrix;

