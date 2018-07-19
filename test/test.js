var dbus = require('dbus-native');
var bus = dbus.systemBus();
describe('org.bluez', function() {
	describe('register org.freedesktop.DBus.ObjectManager signal handler', function() {
		it('InterfacesAdded, InterfacesRemoved', function() {
			bus.getService('org.bluez').getInterface(
				'/', 'org.freedesktop.DBus.ObjectManager', function(err, itf) {
				itf.on('InterfacesAdded', function() {});
				itf.on('InterfacesRemoved', function() {});
			});
		});
	});

	describe('register org.freedesktop.DBus.Properties signal handler', function() {
		it('PropertiesChanged', function() {
			bus.getService('org.bluez').getInterface(
				'/org/bluez/hci0', 'org.freedesktop.DBus.Properties', function(err, itf) {
				itf.on('PropertiesChanged', function() {});
			});
		});
	});
});
