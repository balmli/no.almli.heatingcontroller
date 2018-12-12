'use strict';

const Homey = require('homey');

class HeatingControllerDriver extends Homey.Driver {

    onInit() {
        this.log('HeatingControllerDriver driver has been initialized');
    }

    onPairListDevices(data, callback) {
        let devices = [
            {
                "name": "HeatingController",
                "data": {"id": "HeatingController"}
            }
        ];
        callback(null, devices);
    }

}

module.exports = HeatingControllerDriver;
