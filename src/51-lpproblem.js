class LpProblem extends Problem {
	static init(c,A,b,opt) {
		let p = new LpProblem();
		p.c = Vector.init(c);
		p.A = Matrix.init(A);
		p.b = Vector.init(b);
		p.status = wsolver.PROBLEM_STATUS_INIT;
		p.method = LP_METHOD_INTPOINT;
		return p;
	}

	solve() {
		switch(this.method) {
			case LP_METHOD_BRUTE: this.x = wsolver.solveLpBrute(this.c,this.A,this.b); break;
			case LP_METHOD_INTPOINT: this.x = wsolver.solveLpIntPoint(this.c,this.A,this.b); break;
			case LP_METHOD_SIMPLEX: this.x = wsolver.solveLpSimplex(this.c,this.A,this.b); break;
		}
		this.optVal = this.c.dot(this.x);
		return;
	}
}

wsolver.LpProblem = LpProblem;