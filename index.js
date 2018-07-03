var dbus = require('dbus-native');
var bus = dbus.sessionBus();

bus.getService('org.bluez').getInterface(
	'/',
	'org.freedesktop.DBus.ObjectManager', function(err, itf) {

	console.log(itf);
	
	// dbus signals are EventEmitter events
	itf.on('InterfacesAdded', function() {
		console.log('InterfacesAdded', arguments);
	});

	itf.on('InterfacesRemoved', function() {
		console.log('InterfacesRemoved', arguments);
	});
});

bus.getService('org.bluez').getInterface(
	'/org/bluez/hci0',
	'org.freedesktop.DBus.Properties', function(err, itf) {

	console.log(itf);

	itf.on('PropertiesChanged', function() {
		console.log('PropertiesChanged', arguments);
	});
});