var API = require('../index');
const readline = require('readline');
var target_addr;

readline.emitKeypressEvents(process.stdin);

var bt = new API( function(evt) {
	if (evt.name === 'PropertiesChanged' && evt.property === 'Discovering') {

	} else if (evt.name === 'PropertiesChanged' && evt.property === 'Paired') {
		// console.log(evt.data.Paired);
		bt.connect(target_addr);
	} else if (evt.name === 'InterfacesAdded' && evt.property === 'org.bluez.Device1') {
		if (evt.data.Address === target_addr) {
			bt.scan('off');
			// bt.pair(target_addr);
		}
	} else if (evt.name === 'InterfacesAdded' && evt.property === 'org.bluez.MediaControl1') {
		console.log(evt.data);
	} else if (evt.name === 'InterfacesAdded' && evt.property === 'org.bluez.MediaTransport1') {
		console.log(evt.data);
	} else if (evt.name === 'InterfacesAdded' && evt.property === 'org.bluez.MediaPlayer1') {
		console.log(evt.data);
	} else if (evt.name === 'InterfacesRemoved') {

	}
});

// if (proces-s.argv.length < 3) {
// 	console.log('error: provide target address');
// 	process.exit(1);
// }

// target_addr = process.argv[2];

process.stdin.setRawMode(true);
console.log('---------------------');
console.log('1: scan on');
console.log('2: scan off');
console.log('q: exit');
console.log('---------------------');

process.stdin.on('keypress', (str, key) => {
	if (key.ctrl && key.name ==='c') {
		process.exit();
	} else if (key.name === '1') {
		bt.scan('on');
	} else if (key.name === '2') {
		bt.scan('off');
	} else if (key.name === 'q') {
		process.exit();
	} else {
		// console.log(`pressed "${str}" key`);
	}
});