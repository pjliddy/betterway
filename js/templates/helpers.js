Handlebars.registerHelper('savings', function(price, options) {
  price = parseInt(price.replace(/,/g, ''))
  var savings = (price * .03) - 500
  return savings.toLocaleString()
})

Handlebars.registerHelper('save-label', function(status, options) {
  console.log(options.fn(status))

  if (status === "Sold") {
    return "Saved: "
  } else {
    return "Saving: "
  }
})

Handlebars.registerHelper('status-label', function(status, options) {
  console.log(options.fn(status))

  if (status === "Sold") {
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
