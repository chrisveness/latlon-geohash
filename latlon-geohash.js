/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Geohash encoding/decoding and associated functions   (c) Chris Veness 2014-2019 / MIT Licence  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'; // (geohash-specific) Base32 map


/**
 * Geohash: Gustavo Niemeyer’s geocoding system.
 */
class Geohash {

    /**
     * Encodes latitude/longitude to geohash, either to specified precision or to automatically
     * evaluated precision.
     *
     * @param   {number} lat - Latitude in degrees.
     * @param   {number} lon - Longitude in degrees.
     * @param   {number} [precision] - Number of characters in resulting geohash.
     * @returns {string} Geohash of supplied latitude/longitude.
     * @throws  Invalid geohash.
     *
     * @example
     *     const geohash = Geohash.encode(52.205, 0.119, 7); // => 'u120fxw'
     */
    static encode(lat, lon, precision) {
        // infer precision?
        if (typeof precision == 'undefined') {
            // refine geohash until it matches precision of supplied lat/lon
            for (let p=1; p<=12; p++) {
                const hash = Geohash.encode(lat, lon, p);
                const posn = Geohash.decode(hash);
                if (posn.lat==lat && posn.lon==lon) return hash;
            }
            precision = 12; // set to maximum
        }

        lat = Number(lat);
        lon = Number(lon);
        precision = Number(precision);

        if (isNaN(lat) || isNaN(lon) || isNaN(precision)) throw new Error('Invalid geohash');

        let idx = 0; // index into base32 map
        let bit = 0; // each char holds 5 bits
        let evenBit = true;
        let geohash = '';

        let latMin =  -90, latMax =  90;
        let lonMin = -180, lonMax = 180;

        while (geohash.length < precision) {
            if (evenBit) {
                // bisect E-W longitude
                const lonMid = (lonMin + lonMax) / 2;
                if (lon >= lonMid) {
                    idx = idx*2 + 1;
                    lonMin = lonMid;
                } else {
                    idx = idx*2;
                    lonMax = lonMid;
                }
            } else {
                // bisect N-S latitude
                const latMid = (latMin + latMax) / 2;
                if (lat >= latMid) {
                    idx = idx*2 + 1;
                    latMin = latMid;
                } else {
                    idx = idx*2;
                    latMax = latMid;
                }
            }
            evenBit = !evenBit;

            if (++bit == 5) {
                // 5 bits gives us a character: append it and start over
                geohash += base32.charAt(idx);
                bit = 0;
                idx = 0;
            }
        }

        return geohash;
    }


    /**
     * Decode geohash to latitude/longitude (location is approximate centre of geohash cell,
     *     to reasonable precision).
     *
     * @param   {string} geohash - Geohash string to be converted to latitude/longitude.
     * @returns {{lat:number, lon:number}} (Center of) geohashed location.
     * @throws  Invalid geohash.
     *
     * @example
     *     const latlon = Geohash.decode('u120fxw'); // => { lat: 52.205, lon: 0.1188 }
     */
    static decode(geohash) {

        const bounds = Geohash.bounds(geohash); // <-- the hard work
        // now just determine the centre of the cell...

        const latMin = bounds.sw.lat, lonMin = bounds.sw.lon;
        const latMax = bounds.ne.lat, lonMax = bounds.ne.lon;

        // cell centre
        let lat = (latMin + latMax)/2;
        let lon = (lonMin + lonMax)/2;

        // round to close to centre without excessive precision: ⌊2-log10(Δ°)⌋ decimal places
        lat = lat.toFixed(Math.floor(2-Math.log(latMax-latMin)/Math.LN10));
        lon = lon.toFixed(Math.floor(2-Math.log(lonMax-lonMin)/Math.LN10));

        return { lat: Number(lat), lon: Number(lon) };
    }


    /**
     * Returns SW/NE latitude/longitude bounds of specified geohash.
     *
     * @param   {string} geohash - Cell that bounds are required of.
     * @returns {{sw: {lat: number, lon: number}, ne: {lat: number, lon: number}}}
     * @throws  Invalid geohash.
     */
    static bounds(geohash) {
        if (geohash.length == 0) throw new Error('Invalid geohash');

        geohash = geohash.toLowerCase();

        let evenBit = true;
        let latMin =  -90, latMax =  90;
        let lonMin = -180, lonMax = 180;

        for (let i=0; i<geohash.length; i++) {
            const chr = geohash.charAt(i);
            const idx = base32.indexOf(chr);
            if (idx == -1) throw new Error('Invalid geohash');

            for (let n=4; n>=0; n--) {
                const bitN = idx >> n & 1;
                if (evenBit) {
                    // longitude
                    const lonMid = (lonMin+lonMax) / 2;
                    if (bitN == 1) {
                        lonMin = lonMid;
                    } else {
                        lonMax = lonMid;
                    }
                } else {
                    // latitude
                    const latMid = (latMin+latMax) / 2;
                    if (bitN == 1) {
                        latMin = latMid;
                    } else {
                        latMax = latMid;
                    }
                }
                evenBit = !evenBit;
            }
        }

        const bounds = {
            sw: { lat: latMin, lon: lonMin },
            ne: { lat: latMax, lon: lonMax },
        };

        return bounds;
    }


    /**
     * Determines adjacent cell in given direction.
     *
     * @param   {string} geohash - Cell to which adjacent cell is required.
     * @param   {string} direction - Direction from geohash (N/S/E/W).
     * @returns {string} Geocode of adjacent cell.
     * @throws  Invalid geohash.
     */
    static adjacent(geohash, direction) {
        // based on github.com/davetroy/geohash-js

        geohash = geohash.toLowerCase();
        direction = direction.toLowerCase();

        if (geohash.length == 0) throw new Error('Invalid geohash');
        if ('nsew'.indexOf(direction) == -1) throw new Error('Invalid direction');

        const neighbour = {
            n: [ 'p0r21436x8zb9dcf5h7kjnmqesgutwvy', 'bc01fg45238967deuvhjyznpkmstqrwx' ],
            s: [ '14365h7k9dcfesgujnmqp0r2twvyx8zb', '238967debc01fg45kmstqrwxuvhjyznp' ],
            e: [ 'bc01fg45238967deuvhjyznpkmstqrwx', 'p0r21436x8zb9dcf5h7kjnmqesgutwvy' ],
            w: [ '238967debc01fg45kmstqrwxuvhjyznp', '14365h7k9dcfesgujnmqp0r2twvyx8zb' ],
        };
        const border = {
            n: [ 'prxz',     'bcfguvyz' ],
            s: [ '028b',     '0145hjnp' ],
            e: [ 'bcfguvyz', 'prxz'     ],
            w: [ '0145hjnp', '028b'     ],
        };

        const lastCh = geohash.slice(-1);    // last character of hash
        let parent = geohash.slice(0, -1); // hash without last character

        const type = geohash.length % 2;

        // check for edge-cases which don't share common prefix
        if (border[direction][type].indexOf(lastCh) != -1 && parent != '') {
            parent = Geohash.adjacent(parent, direction);
        }

        // append letter for direction to parent
        return parent + base32.charAt(neighbour[direction][type].indexOf(lastCh));
    }


    /**
     * Returns all 8 adjacent cells to specified geohash.
     *
     * @param   {string} geohash - Geohash neighbours are required of.
     * @returns {{n,ne,e,se,s,sw,w,nw: string}}
     * @throws  Invalid geohash.
     */
    static neighbours(geohash) {
        const n = Geohash.adjacent(geohash, 'n')
        const s = Geohash.adjacent(geohash, 's')
        return {
            'n':  n,
            'ne': Geohash.adjacent(n, 'e'),
            'e':  Geohash.adjacent(geohash, 'e'),
            'se': Geohash.adjacent(s, 'e'),
            's':  s,
            'sw': Geohash.adjacent(s, 'w'),
            'w':  Geohash.adjacent(geohash, 'w'),
            'nw': Geohash.adjacent(n, 'w'),
        };
    }

}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

export default Geohash;
