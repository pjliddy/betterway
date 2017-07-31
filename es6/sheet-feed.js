'use strict'

// window.location.href

const dev = '1oDO9zkpaK1wUSynqYgpQzIs3BJVZN9H19DtwQXBjNfw'
const staging = '1nz4bJDJdKXyGvMbzfAYol6TpwfsVyoeKWKLFFjYa1Hw'
const prod = '1oG10rZemC5R6-EcE8bLUofAMoJaqnsS-lgKxGUCuW2c'

// global listing data object constructor

const ListingData = function ( ) {
  this.getFeed = function () {
    if (window.location.href === 'http://www.bwarealty.com/') {
      return prod
    } else if (window.location.href === 'http://staging.bwarealty.com/') {
      return staging
    } else {
      return dev
    }
  }

  // this.data = []
  this.feed = this.getFeed()
  this.url = 'https://spreadsheets.google.com/feeds/list/' + this.feed + '/od6/public/values?alt=json'
 }

// initialize data from Google Sheets JSON feed

ListingData.prototype.setData = function (feedData) {
  // initialize data array
  this.data = []
  // iterate through listing objects in JSON data feed
  feedData.forEach(obj => {
    // create an empty object for each listing
    let newObj = { }
    // iterate through properties of google sheet JSON feed
    for (let prop in obj) {
      // only save name:value pairs beginning with 'gsx$'
      if (prop.slice(0,4) === 'gsx$') {
        // slice off the first 4 chars of the property name
        const newProp = prop.slice(4)
        // and take the value of $t for that property
        newObj[newProp] = obj[prop].$t

        // convert list(s) into array
        if (newProp === 'images') {
          let arr = newObj[newProp].split(',')
          // remove whitespace before or after comma delimiter
          arr.forEach((e, i, a) => {
            a[i] = e.trim()
          })
          newObj[newProp] = arr
        }
      }
    }
    // push the new data object onto the listing data array
    this.data.push(newObj)
  })
}
