Handlebars.registerHelper('savings', function(price, options) {
  price = parseInt(price.replace(/,/g, ''))
  var savings = (price * .03) - 500
  return savings.toLocaleString()
})

Handlebars.registerHelper('save-label', function(status, options) {
  console.log(status)
  if (status === "Sold") {
    return "Seller Saved: "
  } else {
    return "Potential Seller Savings: "
  }
})
