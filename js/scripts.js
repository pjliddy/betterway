'use strict'

// create global listing data object

let listingData = {
  data: [],
  setData (feedData) {
    console.log(feedData)
    this.data = feedData
    this.createImageArray()
  },
  createImageArray () {
    this.data.forEach(e => {
      e.images = e.gsx$images.$t.split(', ')
    })
  }
}

// set path to Google Sheet with listing data (JSON feed)

const listingPath = "https://spreadsheets.google.com/feeds/list/1hzXzXdK1fqgaZC_eQdxLRFkUOHlW7puy9w9CPrNl5uE/od6/public/values?alt=json"

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

function insertTemplate(target, source, data) {
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

// display modal

function showModal(content) {
  // if there's already a modal
  if ($('.modal').length) {
    // replace the existing modal
    insertTemplate($('.modal')[0], content)
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

//
//  Listing Detail Functions
//

// get data from listingData array from mls number

function getDetailData (mls) {
  // return individual data object from listingData with mls number
  const result = listingData.data.find(
    function (e) {
      return e.gsx$mls.$t == mls
    }
  )
  return result
}

// render and display listing detail in a full screen modal

function showDetails (mls) {
  // getModalTemplate('body','js/templates/detail-modal.hbs', mls);
  getTemplate('js/templates/modal-detail.hbs')
    .then((template) => {
      const data = getDetailData(mls)
      const content = renderTemplate(template, data)
      showModal(content)
    })
    .fail((err) => console.log('listing template is not available'))
}

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
//  Contact Submission Functions
//

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

  $('.listings').on('click', '.see-more', (e) => {
    showDetails($(e.target).data('mls'))
  })

  $('body').on('shown.bs.modal', '#detail-modal', () => {
    setUpGallery()
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
      listingData.setData(data.feed.entry)

      // get template and render
      getTemplate('js/templates/listings.hbs')
        .then((template) => {
          insertTemplate('#listings', template, listingData.data)
        })
        .fail((err) => console.log('listing template is not available'))
    })
    .fail((err) => console.log('data feed is not available'))
})
