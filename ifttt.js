
'use strict';
const maker = require('maker-ifttt');
const IFTTT_MAKER_KEY = require('./config.json').maker
const trigger = new maker(IFTTT_MAKER_KEY);
const EVENT_NAME = require('./config.json').event

trigger.triggerEvent(EVENT_NAME, 'from Ron', function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
    });
});
