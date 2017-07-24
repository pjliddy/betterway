'use strict';

// global listing data object constructor

var ListingData = function ListingData() {
  data: [];
};

// initialize data from Google Sheets JSON feed

ListingData.prototype.setData = function (feedData) {
  var _this = this;

  // initialize data array
  this.data = [];
  // iterate through listing objects in JSON data feed
  feedData.forEach(function (obj) {
    // create an empty object for each listing
    var newObj = {};
    // iterate through properties of google sheet JSON feed
    for (var prop in obj) {
      // only save name:value pairs beginning with 'gsx$'
      if (prop.slice(0, 4) === 'gsx$') {
        // slice off the first 4 chars of the property name
        var newProp = prop.slice(4);
        // and take the value of $t for that property
        newObj[newProp] = obj[prop].$t;

        // convert list(s) into array
        if (newProp === 'images') {
          var arr = newObj[newProp].split(',');
          // remove whitespace before or after comma delimiter
          arr.forEach(function (e, i, a) {
            a[i] = e.trim();
          });
          newObj[newProp] = arr;
        }
      }
    }
    // push the new data object onto the listing data array
    _this.data.push(newObj);
  });
};
//# sourceMappingURL=/Users/pliddy/Documents/dev/betterway/sheet-feed.js.map