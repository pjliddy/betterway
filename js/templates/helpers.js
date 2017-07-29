'use strict'

Handlebars.registerHelper('savings', function(listing, options) {
  if (listing.agentrole.toLowerCase() === 'seller') {
    var price = parseInt(listing.price.replace(/,/g, ''))
    var savings = (price * .03) - 500
  } else {
    var savings = parseInt(listing.buyerfee.replace(/,/g, ''))
  }

  return savings.toLocaleString()
})

Handlebars.registerHelper('save-label', function(status, options) {
  if (status.toLowerCase() === "sold") {
    return "Saved: "
  } else {
    return "Saving: "
  }
})

Handlebars.registerHelper('status-label', function(status, options) {
  if (status.toLowerCase() === "sold") {
    return new Handlebars.SafeString(
      '<p class="caption-status status-sold">'
      + status
      + '</p>')
  } else {
    return new Handlebars.SafeString(
      '<p class="caption-status">'
      + status
      + '</p>')
  }
})

Handlebars.registerHelper('savings-total', function(context, options) {
  var total = 0

  for(var i = 0; i < context.length; i++) {
    if (context[i].agentrole.toLowerCase() === 'seller') {
      var price = parseInt(context[i].price.replace(/,/g, ''))
      var savings = (price * .03) - 500
      total = total + savings
    } else {
      var savings = parseInt(context[i].buyerfee.replace(/,/g, ''))
      total = total + savings
    }
  }
  return total.toLocaleString();
})

Handlebars.registerHelper('hasHalfBaths', function(halfBaths, options) {
  if (parseInt(halfBaths) >= 1) {
    return options.fn(this)
  }
})
