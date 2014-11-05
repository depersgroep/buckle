/*
    Development: IE fix so staging doesn't crash when we use
    console.log messages for debugging
*/
if ('undefined' === typeof console){
    console = {
        log: function() {},
        err: function() {},
        error: function() {}
    };
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/ ) {
		var len = this.length >>> 0;

		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0){
			from += len;
		}
		for (; from < len; from++) {
			if (from in this && this[from] === elt){
				return from;
			}
		}
		return -1;
	};
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
