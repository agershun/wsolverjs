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
