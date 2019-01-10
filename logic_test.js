'use strict';

const heating = require('./lib/heating');


let heatingOptions = {
    workday: {
        startHour: 5,
        endHour: 22.5,
    },
    notWorkday: {
        startHour: 7,
        endHour: 23,
    },
    workHours: {
        startHour: 7,
        endHour: 14
    }
};

let aDate = new Date();
console.log('calcHeating', aDate, heating.calcHeating(aDate, true, false, heatingOptions));

aDate = new Date(2018, 11, 24, 10, 0, 0, 0);
console.log('calcHeating', aDate, heating.calcHeating(aDate, true, false, heatingOptions));

aDate = new Date(2019, 0, 10, 7, 0, 0, 0);
console.log('calcHeating', aDate, heating.calcHeating(aDate, true, false, heatingOptions));

aDate = new Date(2019, 0, 10, 20, 0, 0, 0);
console.log('calcHeating', aDate, heating.calcHeating(aDate, true, false, heatingOptions));

aDate = new Date(2019, 0, 12, 10, 0, 0, 0);
console.log('calcHeating', aDate, heating.calcHeating(aDate, true, false, heatingOptions));

aDate = new Date(2019, 0, 12, 23, 30, 0, 0);
console.log('calcHeating', aDate, heating.calcHeating(aDate, true, false, heatingOptions));

aDate = new Date(2019, 0, 12, 10, 0, 0, 0);
console.log('calcHeating', aDate, heating.calcHeating(aDate, false, false, heatingOptions));

aDate = new Date(2019, 0, 12, 10, 0, 0, 0);
console.log('calcHeating', aDate, heating.calcHeating(aDate, false, true, heatingOptions));

