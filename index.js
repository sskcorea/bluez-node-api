var dbus = require('dbus-native');
var bus = dbus.systemBus();
require('magic-globals');

bus.getService('org.bluez').getInterface(
	'/',
	'org.freedesktop.DBus.ObjectManager', function(err, itf) {

	// dbus signals are EventEmitter events
	itf.on('InterfacesAdded', function() {
		// console.log('InterfacesAdded', arguments);
		arguments[1].forEach(e1 => {
			if (e1[0] === 'org.bluez.Device1') {
				e1[1].forEach(e2 => {
					if (e2[0] === 'ManufacturerData') {
						console.log(e2[0] + ': ');
						console.log(e2[1][1][0][0][1][1]);
					} else if (e2[0] === 'ServiceData ') {
						console.log(e2[0] + ': ');
						console.log(e2[1][1][0][0][1][1]);
					} else {
						console.log(e2[0] + ': ' + e2[1][1]);
					}
				})
			}
		});
		console.log();
	});

	itf.on('InterfacesRemoved', function() {
		console.log('InterfacesRemoved', arguments);
	});
});

bus.getService('org.bluez').getInterface(
	'/org/bluez/hci0',
	'org.freedesktop.DBus.Properties', function(err, itf) {

	itf.on('PropertiesChanged', function() {
		// console.log('PropertiesChanged', arguments);
		arguments[1].forEach(e1 => {
			console.log(e1[0] + ' : ' + e1[1][1]);
		});
	});
});

bus.invoke( {
	path:'/org/bluez/hci0',
	destination: 'org.bluez',
	'interface': 'org.bluez.Adapter1',
	member: 'StartDiscovery',
	type: dbus.messageType.methodCall
}, function (err) {
	if (err)
		console.log(err);
});