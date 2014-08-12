/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Geohash Test Harness                                                   (c) Chris Veness 2014  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict'

var test = require('tape');


test('latlon-geohash', function(assert) {
    var Geohash = require('./latlon-geohash.js');

    assert.equal(Geohash.encode(57.648, 10.410, 6), 'u4pruy', 'encode Jutland');
    assert.deepEqual(Geohash.decode('u4pruy'), { lat: 57.648, lon: 10.410 }, 'decode Jutland');
    assert.equal(Geohash.encode(-25.38262, -49.26561, 8), '6gkzwgjz', 'encode Curitiba');
    assert.deepEqual(Geohash.decode('6gkzwgjz'), { lat: -25.38262, lon: -49.26561 }, 'decode Curitiba');
    assert.deepEqual(Geohash.neighbours('ezzz'), { n:'gbpb', ne:'u000', e:'spbp', se:'spbn', s:'ezzy', sw:'ezzw', w:'ezzx', nw:'gbp8' }, 'neighbours');
    assert.end();
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
