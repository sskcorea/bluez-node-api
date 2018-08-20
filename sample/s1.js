var API = require('../index');
var target_addr;

var bt = new API( function(evt) {
	if (evt.name === 'PropertiesChanged' && evt.property === 'Discovering') {

	} else if (evt.name === 'PropertiesChanged' && evt.property === 'Paired') {
		// console.log(evt.data.Paired);
		bt.connect(target_addr);
	} else if (evt.name === 'InterfacesAdded' && evt.property === 'org.bluez.Device1') {
		if (evt.data.Address === target_addr) {
			bt.scan('off');
			bt.pair(target_addr);
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

if (process.argv.length < 3) {
	console.log('error: provide target address');
	process.exit(1);
}

target_addr = process.argv[2];

bt.scan('on');