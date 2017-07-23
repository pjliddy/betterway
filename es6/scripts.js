'use strict'

// set path to Google Sheet with listing data (JSON feed)
const listingPath = "https://spreadsheets.google.com/feeds/list/1hzXzXdK1fqgaZC_eQdxLRFkUOHlW7puy9w9CPrNl5uE/od6/public/values?alt=json"

// initialize global listing data object
let listingsObj = { }

// global listing data object constructor

const ListingData = function ( ) {
   data: [ ]
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
        // convert list of image names into an array
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

//
// Template Rendering Functions
//

// render template and return html content

function renderTemplate(source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data})
  return content
}

// render template and insert in target element

function replaceTemplate(target, source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data})
  $(target).html(content)
}

// render template and append to target element

function appendTemplate(target, source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data})
  $(target).append(content)
}

// clear element from DOM

function removeTemplate(target) {
  $(target).remove()
}

// display modal

function showModal(content) {
  // if there's already a modal
  if ($('.modal').length) {
    // replace the existing modal
    replaceTemplate($('.modal')[0], content)
  } else {
    // append a new modal to the body
    $('body').append(content)
  }
  // display modal
  $('.modal').modal('show')

}
//
// AJAX calls
//

// make AJAX call to JSON feed and return promise

function getListingData(path) {
  return $.ajax({
    url: path,
    cache: true
  })
}

// make AJAX call to Handlebars template file and return promise

function getTemplate (path) {
  return $.ajax({
    url: path,
    cache: true
  })
}

//  Submit Contact Form

function submitContact (data) {
  return $.ajax({
    url: "./cgi/submit.php",
    type: "POST",
    data: data,
    cache: false
  })
}

//
//  Listing Detail Functions
//

// get data from listingData array from mls number

function getDetailData (mls) {
  for (let i = 0; i < listingsObj.data.length; i++) {
    console.log(listingsObj.data[i])
    if (listingsObj.data[i].mls == mls) {
      console.log(mls)
      return listingsObj.data[i]
    }
  }
}

// render and display listing detail in a full screen modal

function showDetails (mls) {
  getTemplate('js/templates/modal-detail.hbs')
    .then((template) => {
      const data = getDetailData(mls)
      const content = renderTemplate(template, data)
      showModal(content)
    })
    .fail((err) => console.log('listing template is not available'))
}

// jQuery Gallery Setup

function setUpGallery() {
  // $('.flexslider').flexslider({
  //   animation: "slide"
  // })

  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 210,
    itemMargin: 5,
    asNavFor: '#slider'
  })

  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel"
  })
}

//
//  Contact Form Modal Functions
//

function showContactForm () {
  getTemplate('js/templates/modal-contact.hbs')
    .then((template) => {
      const content = renderTemplate(template)
      showModal(content)
      // auto-format phone number on input
      $("#phone").mask("(999) 999-9999",{placeholder:" "})
    })
    .fail((err) => console.log('contact template is not available'))
}

function showSubmitError () {
  getTemplate('js/templates/modal-submit-error.hbs')
    .then((template) => {
      const content = renderTemplate(template)
      showModal(content)
    })
    .fail((err) => console.log('submit errror template is not available'))
}

function showSubmitSuccess () {
  getTemplate('js/templates/modal-submit-success.hbs')
    .then((template) => {
      const content = renderTemplate(template)
      showModal(content)
    })
    .fail((err) => console.log('submit success template is not available'))
}
//
//  Event Handlers
//

function handleEvents () {
  // jQuery for page scrolling feature using jQuery Easing plugin
  $('a.page-scroll').bind('click', function(event) {
      const $anchor = $(this)
      $('html, body').stop().animate({
          scrollTop: ($($anchor.attr('href')).offset().top - 50)
      }, 800, 'easeInOutExpo')
      event.preventDefault()
  });

  // Highlight the top nav as page scrolls
  $('body').scrollspy({
      target: '.navbar-fixed-top',
      offset: 51
  })

  // Close the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function(){
    $('.navbar-toggle:visible').click()
  })

  // Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 100
    }
  })

  // show listing detail modal when "see more" is clicked
  $('.listings').on('click', '.see-more', (e) => {
    showDetails($(e.target).data('mls'))
  })

  // show contact form modal when button is clicked
  $('.contact-btn').click((e) => {
    showContactForm()
  })

  // submit contact form
  $('body').on('submit', 'form#contact-form', event => {
    console.log('submit form')
    event.preventDefault()
    const name = $("input#firstName").val() + ' ' + $("input#lastName").val()
    const email = $("input#email").val()
    const phone = $("input#phone").val()
    const data = {
      name: name,
      email: email,
      phone: phone
    }
    submitContact(data)
      .then(showSubmitSuccess)
      .fail(showSubmitError)

    // reset form fields
    $("form#contact-form input").val('')
  })

  // initialize jquery gallery in detail modal
  $('body').on('shown.bs.modal', '#detail-modal', () => {
    setUpGallery()
  })

  // clear modal from DOM when closed
  $('body').on('hidden.bs.modal', '.modal', () => {
    removeTemplate('.modal')
  })
}

//
// Document Ready
//

$(function() {
  // set event handlers
  handleEvents()

  // get data from JSON feed and wait for promise to be returned
  getListingData(listingPath)
    .then((data) => {
      // set global listing object to JSON feed data
      listingsObj = new ListingData()

      listingsObj.setData(data.feed.entry)

      // get template and render
      getTemplate('js/templates/listings.hbs')
        .then((template) => {
          replaceTemplate('#listings', template, listingsObj.data)
        })
        .fail((err) => console.log('listing template is not available'))
    })
    .fail((err) => console.log('data feed is not available'))
})
