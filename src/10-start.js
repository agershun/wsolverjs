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

