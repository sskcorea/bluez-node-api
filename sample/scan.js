var API = require('../index');
var bt = new API();

bt.scan('on', function (d, e) {
	console.log(d);
	bt.scan('off');
});