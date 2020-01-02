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