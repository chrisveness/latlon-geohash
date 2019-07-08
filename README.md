geohash
=======

Functions to convert a [geohash](http://en.wikipedia.org/wiki/Geohash) to/from a latitude/longitude
point, and to determine bounds of a geohash cell and find neighbours of a geohash.

Note this version 2 uses ES classes and modules: for older browsers (or Node.js <8.0.0), 
[v1.1.0](https://github.com/chrisveness/latlon-geohash/tree/v1.1.0) is ES5-based.

API
---

- `Geohash.encode(lat, lon, [precision])`: encode latitude/longitude point to geohash of given precision
   (number of characters in resulting geohash); if precision is not specified, it is inferred from
   precision of latitude/longitude values.
- `Geohash.decode(geohash)`: return { lat, lon } of centre of given geohash, to appropriate precision.
- `Geohash.bounds(geohash)`: return { sw, ne } bounds of given geohash.
- `Geohash.adjacent(geohash, direction)`: return adjacent cell to given geohash in specified direction (N/S/E/W).
- `Geohash.neighbours(geohash)`: return all 8 adjacent cells (n/ne/e/se/s/sw/w/nw) to given geohash.

Note to obtain neighbours as an array, you can use

    const neighboursObj = Geohash.neighbours(geohash);
    const neighboursArr = Object.keys(neighboursObj).map(n => neighboursObj[n]);

The parent of a geocode is simply `geocode.slice(0, -1)`.

If you want the geohash converted from Base32 to Base4, you can e.g.:

    parseInt(Geohash.encode(52.20, 0.12, 6), 32).toString(4);


Usage in browser
----------------

Geohash can be used in the browser by taking a local copy, or loading it from
    [jsDelivr](https://www.jsdelivr.com/package/npm/latlon-geohash): for example,

```html
<!doctype html><title>geohash example</title><meta charset="utf-8">
<script type="module">
    import Geohash from 'https://cdn.jsdelivr.net/npm/latlon-geohash@2.0.0';

    const geohash = Geohash.encode(52.20, 0.12, 6);
    console.assert(geohash == 'u120fw');

    const latlon = Geohash.decode('u120fw');
    console.assert(JSON.stringify(latlon) == '{"lat":52.1988,"lon":0.115}');
</script>
```


Usage in Node.js
----------------

Geohash can be used in a Node.js app from [npm](https://www.npmjs.com/package/latlon-geohash) 
(currently the [esm](https://www.npmjs.com/package/esm) package is required to load ES-modules):

```shell
$ npm install latlon-geohash esm
$ node -r esm
> import Geohash from 'latlon-geohash';
> const geohash = Geohash.encode(52.20, 0.12, 6);
> console.assert(geohash == 'u120fw');
> const latlon = Geohash.decode('u120fw');
> console.assert(JSON.stringify(latlon) == '{"lat":52.1988,"lon":0.115}');
```

Further details
---------------

More information (with interactive conversion) at
[www.movable-type.co.uk/scripts/geohash.html](http://www.movable-type.co.uk/scripts/geohash.html).

Full JsDoc at [www.movable-type.co.uk/scripts/js/latlon-geohash/docs/Geohash.html](http://www.movable-type.co.uk/scripts/js/latlon-geohash/docs/Geohash.html).
