
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



}	

wsolver.Matrix = Matrix;
