'use strict';

const Homey = require('homey');

class HeatingControllerApp extends Homey.App {

    async onInit() {
        this.log('HeatingControllerApp is running...');
    }

}

module.exports = HeatingControllerApp;
