var api = require('../index');

api.scan(function (d) {
	d.forEach(e1 => {
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