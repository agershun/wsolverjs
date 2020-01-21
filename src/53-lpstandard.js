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

	solve(opt) {
		if(!this.method) this.method = LP_METHOD_BRUTE;
		if(opt && opt.method) this.method = opt.method;
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

	toString() {

		let ss = 'min';
		for(let j=0;j<this.c.size;j++) {
			ss += ' ';
			if(this.c.data[j] > 0) {
				if(j!=0) ss += '+';
				ss += this.c.data[j];
				ss += 'y'+j;
			} else if(this.c.data[j] < 0) {
				ss += '-'+(-this.c.data[j]);
				ss += 'y'+j;
			}
		} 
		ss += '\n';

		for(let i=0;i<this.A.rsize;i++) {
			for(let j=0;j<this.A.csize;j++) {
				ss += ' ';
				if(this.A.data[i][j] > 0) {
					if(j!=0) ss += '+';
					ss += this.A.data[i][j];
					ss += 'y'+j;
				} else if(this.A.data[i][j] < 0) {
					ss += '-'+(-this.A.data[i][j]);
					ss += 'y'+j;
				}
			} 
			ss += ' = '+this.b.data[i];
			ss += '\n';		
		}

		return ss;
	}

}

wsolver.LpStandard = LpStandard;