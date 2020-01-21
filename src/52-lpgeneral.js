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
								// console.log(103,i,j,l[j],u[j],slack);
								break;				
							case STD_VAR_LO: 				
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								// console.log(108,i,j,l[j],u[j])
								break;				
							case STD_VAR_LO_UP: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								// console.log(117,i,j,l[j],u[j],slack)
								break;
							case STD_VAR_FX: 
								slack += l[j]*g.A.data[i][j];
								// console.log(112,i,j,l[j],u[j])
								break;
						}
					}
					A.data[rm][vn+xr[i].sn] = 1;
					b.data[rm] = U[i] - slack;
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
								slack += -u[j]*g.A.data[i][j];
								// console.log(136,i,j,l[j],u[j])
								break;				
							case STD_VAR_LO: 				
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								// console.log(141,i,j,l[j],u[j])
								break;				
							case STD_VAR_LO_UP: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								// console.log(150,i,j,l[j],u[j],xv[j]);								
								break;
							case STD_VAR_FX: 
								slack += l[j]*g.A.data[i][j];
								// console.log(145,i,j,l[j],u[j])
								break;
						}
					}				
					A.data[rm][vn+xr[i].sn] = 1;
					// console.log(155,L[i],U[i],slack);
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
								slack += -u[j]*g.A.data[i][j];
								// console.log(169,i,j,l[j],u[j]);
								break;				
							case STD_VAR_LO: 				
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								// console.log(174,i,j,l[j],u[j]);
								break;				
							case STD_VAR_LO_UP: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								// console.log(183,i,j,l[j],u[j],slack);
								break;
							case STD_VAR_FX: 
								slack += l[j]*g.A.data[i][j];
								// console.log(178,i,j,l[j],u[j]);
								break;
						}
					}
					b.data[rm] = U[i] - slack;
					rm++;					
					break;
				case STD_ROW_L_G:
					// Two lines
					for(let j=0;j<csize;j++) {
						switch(xv[j].type) {
							case STD_VAR_FR: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];			
								A.data[rm][xv[j].vn+1] = g.A.data[i][j];			
								A.data[rm+1][xv[j].vn] = g.A.data[i][j];			
								A.data[rm+1][xv[j].vn+1] = -g.A.data[i][j];			
								break;
							case STD_VAR_UP: 
								A.data[rm][xv[j].vn] = g.A.data[i][j];
								A.data[rm+1][xv[j].vn] = -g.A.data[i][j];
								slack += -u[j]*g.A.data[i][j];
								break;				
							case STD_VAR_LO: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								A.data[rm+1][xv[j].vn] = g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								break;				
							case STD_VAR_LO_UP: 
								A.data[rm][xv[j].vn] = -g.A.data[i][j];
								A.data[rm+1][xv[j].vn] = g.A.data[i][j];
								slack += l[j]*g.A.data[i][j];
								break;
							case STD_VAR_FX: 
								slack += l[j]*g.A.data[i][j];
								break;
						}
					}
					A.data[rm][vn+xr[i].sn] = 1;
					A.data[rm+1][vn+xr[i].sn+1] = 1;
					b.data[rm] = -L[i] + slack;
					b.data[rm+1] = U[i] - slack;
					rm+=2;
					break;
			}
		}

		return s;

	}

	fromStandard(s) {
		// console.log(258,this.toString());
		// console.log(259,s.toString());
		if(s.x == -1) return -1;
		let csize = this.A.csize;
		// console.log(259,'fromStandard',csize);
		let xv = this.xv;
		this.x = Vector.zeros(csize);
		for(let j=0;j<csize;j++) {
			let type = xv[j].type;
			// console.log(165,xv[j],this.v[j],s.x);
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
		let g = this;
		g.vars = {};
		// console.log(269,g);
		for(let j=0;j<g.v.length;j++) {
			g.vars[g.v[j]] = g.x.data[j];
		}
		g.rows = {};
		g.rows[this.objName] = g.objVal;
		for(let i=0;i<g.n.length;i++) {
			g.rows[g.n[i]] = g.A.row(i).dot(g.x);
		}		

	}

	solve(opt) {
		let s = this.toStandard();
		s.solve(opt);
		this.fromStandard(s);
	}

	toString() {
		let l = this.l,u = this.u, L = this.L,U = this.U, v = this.v;

		let ss = 'min';
		for(let j=0;j<this.c.size;j++) {
			ss += ' ';
			if(this.c.data[j] > 0) {
				ss += '+';
				ss += this.c.data[j];
				ss += v[j];
			} else if(this.c.data[j] < 0) {
				ss += '-'+(-this.c.data[j]);
				ss += v[j];
			}
		} 
		ss += '\n';

		for(let i=0;i<this.A.rsize;i++) {

			ss += this.n[i]+': ';

			if(L[i] > -Infinity) {
				if(L[i]!=U[i]) {
					ss += L[i] + ' <= ';
				}
			}

			for(let j=0;j<this.A.csize;j++) {
				ss += ' ';
				if(this.A.data[i][j] > 0) {
					if(j!=0) ss += '+';
					ss += this.A.data[i][j];
					ss += v[j];
				} else if(this.A.data[i][j] < 0) {
					ss += '-'+(-this.A.data[i][j]);
					ss += v[j];
				}
			} 
			if(U[i] < Infinity) {
				if(L[i]!=U[i]) {
					ss += ' <= ' + U[i];
				} else {
					ss += ' = ' + U[i];
				}
			}
			ss += '\n';		
		}

		for(let j=0;j<this.c.size;j++) {
			if(l[j] == u[j]) {
				ss += v[j] +' = '+l[j];
			} else {
				if(l[j]>-Infinity) {
					ss += l[j] +' <= ';
				}
				if(l[j]>-Infinity || u[j]<Infinity) {
					ss += v[j];
				}
				if(u[j]<Infinity) {
					ss += ' <= '+u[j];
				}
			}
			ss += '\n';
		}		

		return ss;
	}


}

wsolver.LpGeneral = LpGeneral;