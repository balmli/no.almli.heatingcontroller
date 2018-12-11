'use strict';

const Homey = require('homey');

class HomeStateDriver extends Homey.Driver {

    onInit() {
        this.log('HomeStateDriver driver has been initialized');
    }

    onPairListDevices(data, callback) {
        let devices = [
            {
                "name": "HomeState",
                "data": {"id": "HomeState"}
            }
        ];
        callback(null, devices);
    }

}

module.exports = HomeStateDriver;
