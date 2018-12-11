'use strict';

const Homey = require('homey');

class HomeStateApp extends Homey.App {

    async onInit() {
        this.log('HomeStateApp is running...');
    }

}

module.exports = HomeStateApp;
