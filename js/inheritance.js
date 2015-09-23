function inherit(cls, sup) {
	function dummy() {}
	dummy.prototype = sup.prototype;
	cls.prototype = new dummy();
	cls.prototype.constructor = sup;
}
