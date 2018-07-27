var DBus = require('dbus');
var bus = DBus.getBus('system');
var user_cb;

var API = module.exports = function () {
	bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.freedesktop.DBus.Properties', function(err, iface) {
		if (err)
			console.log(err);

		iface.on('PropertiesChanged', function(count) {
			console.log(arguments);
		});
	});

	bus.getInterface('org.bluez', '/', 'org.freedesktop.DBus.ObjectManager', function(err, iface) {
		itf_objectmanager = iface;
		itf_objectmanager.on('InterfacesAdded', function(count) {
			if (user_cb)
				user_cb(arguments[1]['org.bluez.Device1']);
		});

		itf_objectmanager.on('InterfacesRemoved', function(count) {
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
				console.log('StopDiscovery');
			});
		});
	}
};

API.prototype.discoverable = function(onoff, cb) {
	if (onoff === 'on') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.freedesktop.DBus.Properties', function(err, iface) {
			iface.Set('org.bluez.Adapter1', 'Discoverable', true, function() {
				console.log('Discoverable On');
			});
		});

	} else if (onoff === 'off') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.freedesktop.DBus.Properties', function(err, iface) {
			iface.Set('org.bluez.Adapter1', 'Discoverable', false, function() {
				console.log('Discoverable Off');
			});
		});
	}
};

API.prototype.adv = function(onoff, cb) {
	if (onoff === 'on') {
		// Create a new service, object and interface
		var service = DBus.registerService('system', 'org.bluez');
		var obj = service.createObject('/bluenode/adv');

		// Create interface
		var iface1 = obj.createInterface('org.bluez.LEAdvertisement1');

		iface1.addMethod('Release', {}, function(callback) {
			console.log('Release');
		});

		// Writable property
		iface1.addProperty('Type', {
			type: DBus.Define(String),
			getter: function(cb) {
				cb(null, 'broadcast');
			}
		});

		iface1.addProperty('ServiceUUIDs', {
			type: 'as',
			getter: function(cb) {
				cb(null, ['cccc']);
			}
		});

		iface1.addProperty('ManufacturerData', {
			type: 'a{qv}',
			getter: function(cb) {
				cb(null, []);
			}
		});

		iface1.addProperty('SolicitUUIDs', {
			type: 'as',
			getter: function(cb) {
				cb(null, []);
			}
		});

		iface1.addProperty('ServiceData', {
			type: 'a{sv}',
			getter: function(cb) {
				cb(null, ['cccc', 0x01, 0x02, 0x03, 0x04]);
			}
		});

		iface1.addProperty('IncludeTxPower', {
			type: DBus.Define(Boolean),
			getter: function(cb) {
				cb(null, true);
			}
		});

		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.bluez.LEAdvertisingManager1', function(err, iface) {
			if (err) throw err;
			iface.RegisterAdvertisement('/bluenode/adv', function() {
				console.log('RegisterAdvertisement');
			});
		});
	} else if (onoff ==='off') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', 'org.bluez.LEAdvertisingManager1', function(err, iface) {
			iface.UnregisterAdvertisement('/bluenode/adv', function() {
				console.log('UnregisterAdvertisement');
			});
		});
	}
};