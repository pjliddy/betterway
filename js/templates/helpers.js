Handlebars.registerHelper('savings', function(price, options) {
  price = parseInt(price.replace(/,/g, ''))
  var savings = (price * .03) - 500
  return savings.toLocaleString()
})

Handlebars.registerHelper('save-label', function(status, options) {
  if (status === "Sold") {
    return "Saved: "
  } else {
    return "Saving: "
  }
})

Handlebars.registerHelper('status-label', function(status, options) {
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

Handlebars.registerHelper('savings-total', function(context, options) {
  var total = 0;

  for(var i = 0; i < context.length; i++) {
    var price = context[i].price
    price = parseInt(price.replace(/,/g, ''))
    var savings = (price * .03) - 500
    // var price = parseInt(price.replace(/,/g, ''))
    total = total + savings;
  }
  console.log(total.toLocaleString())
  return total.toLocaleString();
});
