var DBus = require('dbus');
var bus = DBus.getBus('system');
const Properties = 'org.freedesktop.DBus.Properties';
const ObjectManager = 'org.freedesktop.DBus.ObjectManager';
const Device1 = 'org.bluez.Device1';
const Adapter1 = 'org.bluez.Adapter1';
const MediaControl1 = 'org.bluez.MediaControl1';
const MediaTransport1 = 'org.bluez.MediaTransport1';
const MediaPlayer1 = 'org.bluez.MediaPlayer1';
const LEAdvertisingManager1 = 'org.bluez.LEAdvertisingManager1';

var API = module.exports = function (cb) {

	bus.getInterface('org.bluez', '/org/bluez/hci0', Properties, function(err, iface) {
		iface.on('PropertiesChanged', function(count) {
			// console.log(arguments);
			if (arguments[1].hasOwnProperty('Discovering')) {
				cb({name: 'PropertiesChanged', property: 'Discovering', data: arguments[1]['Discovering']});
			}
		});
	});

	bus.getInterface('org.bluez', '/', ObjectManager, function(err, iface) {
		iface.on('InterfacesAdded', function(count) {
			// console.log('InterfaceAdded');
			// console.log(arguments);

			if (arguments[1].hasOwnProperty(Device1)) {
				bus.getInterface('org.bluez', arguments[0], Properties, (err, iface) => {
					iface.on('PropertiesChanged', function(count) {
						console.log(arguments[0] + ' PropertiesChanged');
						console.log(arguments);
						if (arguments[1].hasOwnProperty('Paired')) {
							cb({name: 'PropertiesChanged', property: 'Paired', data: arguments[1]['Paired']});
						}
					});
				});
				cb({name: 'InterfacesAdded', property: Device1, data: arguments[1][Device1]});
			} else if (arguments[1].hasOwnProperty(MediaControl1)) {
				cb({name: 'InterfacesAdded', property: MediaControl1, data: arguments[1][MediaControl1]});
			} else if (arguments[1].hasOwnProperty(MediaTransport1)) {
				cb({name: 'InterfacesAdded', property: MediaTransport1, data: arguments[1][MediaTransport1]});
			} else if (arguments[1].hasOwnProperty(MediaPlayer1)) {
				cb({name: 'InterfacesAdded', property: MediaPlayer1, data: arguments[1][MediaPlayer1]});
			}
		});

		iface.on('InterfacesRemoved', function(count) {
			// console.log('InterfaceRemoved');
			// console.log(arguments);
		});
	});
}

addr2path = function(addr) {
	var path='dev';

	addr.split(":").forEach(e => { path += '_' + e; });

	return path;
};

API.prototype.get_managed_objs = function(addr, cb) {
	var p = '/org/bluez/hci0/' + addr2path(addr);

	bus.getInterface('org.bluez', '/', ObjectManager, function(err, iface) {
		iface.GetManagedObjects( function(err) {
			arguments[1][p];
		});
	});
};

API.prototype.pair = function(addr) {
	var p = '/org/bluez/hci0/' + addr2path(addr);

	bus.getInterface('org.bluez', p, Device1, function(err, iface) {
		iface.Pair( function(err) {
			if (err) throw err;
			console.log('Pair');
		});
	});
};

API.prototype.connect = function(addr) {
	var p = '/org/bluez/hci0/' + addr2path(addr);

	bus.getInterface('org.bluez', p, Device1, function(err, iface) {
		iface.Connect( function(err) {
			if (err) throw err;
			console.log('Connect');
		});
	});
};

API.prototype.scan = function(onoff) {
	if (onoff === 'on') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', Adapter1, function(err, iface) {
			iface.StartDiscovery({}, function(err) {
				console.log('StartDiscovery');
			});
		});
	} else if (onoff === 'off') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', Adapter1, function(err, iface) {
			iface.StopDiscovery({}, function(err) {
				console.log('StopDiscovery');
			});
		});
	}
};

API.prototype.discoverable = function(onoff, cb) {
	if (onoff === 'on') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', Properties, function(err, iface) {
			iface.Set('org.bluez.Adapter1', 'Discoverable', true, function() {
				console.log('Discoverable On');
			});
		});

	} else if (onoff === 'off') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', Properties, function(err, iface) {
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

		bus.getInterface('org.bluez', '/org/bluez/hci0', LEAdvertisingManager1, function(err, iface) {
			if (err) throw err;
			iface.RegisterAdvertisement('/bluenode/adv', function() {
				console.log('RegisterAdvertisement');
			});
		});
	} else if (onoff ==='off') {
		bus.getInterface('org.bluez', '/org/bluez/hci0', LEAdvertisingManager1, function(err, iface) {
			iface.UnregisterAdvertisement('/bluenode/adv', function() {
				console.log('UnregisterAdvertisement');
			});
		});
	}
};