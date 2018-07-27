var DBus = require('dbus');

var bus = DBus.getBus('system');
var user_cb;

var API = function () {
	bus.getInterface(
		'org.bluez',
		'/org/bluez/hci0',
		'org.freedesktop.DBus.Properties', function(err, iface) {

		iface.on('PropertiesChanged', function(count) {
			console.log('Discovering: ' + arguments[1].Discovering);
		});
	});

	bus.getInterface(
		'org.bluez',
		'/',
		'org.freedesktop.DBus.ObjectManager', function(err, iface) {

		iface.on('InterfacesAdded', function(count) {
			if (user_cb)
				user_cb(arguments[1]['org.bluez.Device1']);
		});

		iface.on('InterfacesRemoved', function(count) {
			console.log(arguments[1]['org.bluez.Device1'].Address);
		});
	});
}

API.prototype.scan = function(onoff, cb) {
	if (onoff === 'on') {
		user_cb = cb;
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.bluez.Adapter1', function(err, iface) {
			iface.StartDiscovery({}, function(err) {
				console.log('StartDiscovery');
			});
		});
	} else if (onoff === 'off') {
		user_cb = null;
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.bluez.Adapter1', function(err, iface) {
			iface.StopDiscovery({}, function(err) {
				console.log('StartDiscovery');
			});
		});
	}
};

API.prototype.discoverable = function(onoff, cb) {
	if (onoff === 'on') {
		user_cb = cb;
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.freedesktop.DBus.Properties', function(err, iface) {
			iface.Set('org.bluez.Adapter1', 'Discoverable', true, function() {
			});
		});
	} else if (onoff === 'off') {
		user_cb = null;
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.freedesktop.DBus.Properties', function(err, iface) {
			iface.Set('org.bluez.Adapter1', 'Discoverable', false, function() {
			});
		});
	}
};

API.prototype.adv = function(onoff, cb) {
	if (onoff === 'on') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.bluez.LEAdvertisingManager1', function(err, iface) {
			iface.RegisterAdvertisement('/bluenode/adv', function() {
				console.log('RegisterAdvertisement');
			});
		});
	} else if (onoff ==='off') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.bluez.LEAdvertisingManager1', function(err, iface) {
			iface.UnregisterAdvertisement('/bluenode/adv', function() {
				console.log('RegisterAdvertisement');
			});
		});
	}
};

module.exports = API;