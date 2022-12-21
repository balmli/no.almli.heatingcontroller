const Homey = require('homey');

module.exports = class HeatingControllerDriver extends Homey.Driver {

    async onInit() {
        this.log('HeatingControllerDriver driver has been initialized');
    }

    async onPairListDevices() {
        const syncTime = Math.round(Math.random() * 3600);
        return [
            {
                name: "Heating Controller",
                data: {
                    "id": guid()
                },
                store: {
                    syncTime
                }
            }
        ];
    }

};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
