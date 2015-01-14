geohash
=======

Functions to convert a [geohash](http://en.wikipedia.org/wiki/Geohash) to/from a latitude/longitude
point, and to determine bounds of a geohash cell and find neighbours of a geohash.

Methods summary:

- `encode`: latitude/longitude point to geohash
- `decode`: geohash to latitude/longitude
- `bounds` of a geohash cell
- `adjacent` `neighbours` of a geohash

Install
-------

### in browser

Download the JavaScript [source](https://raw.githubusercontent.com/chrisveness/geodesy/master/latlon-geohash.js)
and reference in HTML page using:

    <script src="js/latlon-geohash.js"></script>

### from npm

    npm install --save latlon-geohash

Usage
-----


- `Geohash.encode(lat, lon, [precision])`: encode latitude/longitude point to geohash of given precision
   (number of characters in resulting geohash); if precision is not specified, it is inferred from
   precision of latitude/longitude values.
- `Geohash.decode(geohash)`: return { lat, lon } of centre of given geohash, to appropriate precision.
- `Geohash.bounds(geohash)`: return { sw, ne } bounds of given geohash.
- `Geohash.adjacent(geohash, direction)`: return adjacent cell to given geohash in specified direction (N/S/E/W).
- `Geohash.neighbours(geohash)`: return all 8 adjacent cells (n/ne/e/se/s/sw/w/nw) to given geohash.

Note to obtain neighbours as an array, you can use

    var neighboursObj = Geohash.neighbours(geohash);
    var neighboursArr = Object.keys(neighboursObj).map(function(n) { return neighboursObj[n]; });

Note that the parent of a geocode is simply `geocode.slice(0, -1)`.

### Import within node.js

    var Geohash = require('latlon-geohash');

Further details
---------------

More information (with interactive conversion) at
[www.movable-type.co.uk/scripts/geohash.html](http://www.movable-type.co.uk/scripts/geohash.html).

Full JsDoc at [www.movable-type.co.uk/scripts/js/latlon-geohash/docs/Geohash.html](http://www.movable-type.co.uk/scripts/js/latlon-geohash/docs/Geohash.html).
