var API = require('../index');
var bt = new API();

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

bt.scan('on', function (d, e) {
	if (e) throw e;
	console.log(d);

	bt.scan('off');
});

async function run() {
	await sleep(3000);
	bt.adv('on');

	// await sleep(3000);
	bt.discoverable('on');

	await sleep(3000);
	bt.discoverable('off');
	bt.adv('off');
}

run();