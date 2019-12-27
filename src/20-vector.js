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
			throw 'wrong type'
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
    	let res = true;
    	if(this.size != b.size) {
    		throw 'Size is different';
    	}
    	for(let i=0;i<this.size;i++) {
    		if(!almost(this.data[i],b.data[i])) res = false;
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

}

wsolver.Vector = Vector;
