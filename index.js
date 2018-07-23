var dbus = require('dbus-native');
var bus = dbus.systemBus();
require('magic-globals');

var user_cb;

bus.getService('org.bluez').getInterface(
	'/',
	'org.freedesktop.DBus.ObjectManager', function(err, itf) {

	// dbus signals are EventEmitter events
	itf.on('InterfacesAdded', function() {
		user_cb(arguments[1]);
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

module.exports.scan = function(cb) {
	user_cb = cb;

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
};