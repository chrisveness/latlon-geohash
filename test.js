/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Geohash Test Harness                                (c) Chris Veness 2014-2016 / MIT Licence  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict'

const chai = require('chai');  // BDD/TDD assertion library

const Geohash = require('./latlon-geohash.js');

const should = chai.should();

describe('latlon-geohash', function() {

    it('encodes Jutland',     function() { Geohash.encode(57.648, 10.410, 6).should.equal('u4pruy'); });
    it('decodes Jutland',     function() { Geohash.decode('u4pruy').should.deep.equal({ lat: 57.648, lon: 10.410 }); });
    it('encodes Curitiba',    function() { Geohash.encode(-25.38262, -49.26561, 8).should.equal('6gkzwgjz'); });
    it('decodes Curitiba',    function() { Geohash.decode('6gkzwgjz').should.deep.equal({ lat: -25.38262, lon: -49.26561 }); });
    it('fetches neighbours',  function() { Geohash.neighbours('ezzz').should.deep.equal({ n:'gbpb', ne:'u000', e:'spbp', se:'spbn', s:'ezzy', sw:'ezzw', w:'ezzx', nw:'gbp8' }); });
    it('matches geohash.org', function() { Geohash.encode(37.25, 123.75, 12).should.equal('wy85bj0hbp21'); }); // (also PostGIS; thx Jussi Nieminen)

});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
