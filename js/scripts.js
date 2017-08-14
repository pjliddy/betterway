'use strict'

// initialize global listing data object

const dev = '1oDO9zkpaK1wUSynqYgpQzIs3BJVZN9H19DtwQXBjNfw'
const staging = '1nz4bJDJdKXyGvMbzfAYol6TpwfsVyoeKWKLFFjYa1Hw'
const prod = '1oG10rZemC5R6-EcE8bLUofAMoJaqnsS-lgKxGUCuW2c'

let listingsObj

//
// Template Rendering Functions
//

// render template and return html content

function renderTemplate(source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data:data})
  return content
}

// render template and insert in target element

function replaceTemplate(target, source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data:data})
  $(target).html(content)
}

// render template and append to target element

function appendTemplate(target, source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data:data})
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
    url: './cgi/submit.php',
    type: 'POST',
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
    if (listingsObj.data[i].mls == mls) {
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
    .fail((err) => console.log('listing template is not available', err))
}

// jQuery Gallery Setup

function setUpGallery() {
  Galleria.loadTheme('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js');

  Galleria.run('.galleria');

  // $('#imageGallery').lightSlider({
  //       gallery:true,
  //       item:1,
  //       loop:true,
  //       thumbItem:9,
  //       slideMargin:0,
  //       enableDrag: false,
  //       currentPagerPosition:'left',
  //       onSliderLoad: function(el) {
  //           el.lightGallery({
  //               selector: '#imageGallery .lslide'
  //           });
  //       }
  //   });

  // $("#lightSlider").lightSlider({
  //   autoWidth:true,
  //   item:4,
  //   loop:true,
  //   slideMove:2,
  //   easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
  //   speed:600,
    // responsive : [
    //     {
    //         breakpoint:800,
    //         settings: {
    //             item:3,
    //             slideMove:1,
    //             slideMargin:6,
    //           }
    //     },
    //     {
    //         breakpoint:480,
    //         settings: {
    //             item:2,
    //             slideMove:1
    //           }
    //     }
    // ]
    // });

  // $('#carousel').flexslider({
  //   animation: 'slide',
  //   controlNav: false,
  //   animationLoop: false,
  //   slideshow: false,
  //   itemWidth: 210,
  //   itemMargin: 5,
  //   asNavFor: '#slider'
  // })

  // $('#slider').flexslider({
  //   animation: 'slide',
  //   controlNav: false,
  //   animationLoop: false,
  //   slideshow: false,
  //   sync: '#carousel'
  // })
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
      $('#phone').mask('(999) 999-9999',{placeholder:' '})
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
          scrollTop: ($($anchor.attr('href')).offset().top - 92)
      }, 800, 'easeInOutExpo')
      event.preventDefault()
  })

  // Highlight the top nav as page scrolls
  $('body').scrollspy({
      target: '.navbar-fixed-top',
      offset: 92
  })

  // Close the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function(){
    $('.navbar-toggle:visible').click()
  })

  // Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 92
    }
  })

  // show listing detail modal when 'see more' is clicked
  $('.listings').on('click', '.see-more', (e) => {
    showDetails($(e.target).data('mls'))
  })

  // show contact form modal when button is clicked
  $('.contact-btn').click(() => {
    showContactForm()
  })

  // submit contact form
  $('body').on('submit', 'form#contact-form', event => {
    event.preventDefault()
    const name = $('input#firstName').val() + ' ' + $('input#lastName').val()
    const email = $('input#email').val()
    const phone = $('input#phone').val()
    const data = {
      name: name,
      email: email,
      phone: phone
    }
    submitContact(data)
      .then(showSubmitSuccess)
      .fail(showSubmitError)

    // reset form fields
    $('form#contact-form input').val('')
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
  listingsObj = new ListingData(prod, dev, staging)

  getListingData(listingsObj.url)
    .then((data) => {
      // set global listing object to JSON feed data
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
