'use strict';

// set path to Google Sheet with listing data (JSON feed)
// const listingPath = "https://spreadsheets.google.com/feeds/list/1hzXzXdK1fqgaZC_eQdxLRFkUOHlW7puy9w9CPrNl5uE/od6/public/values?alt=json"

var listingPath = "https://spreadsheets.google.com/feeds/list/1oG10rZemC5R6-EcE8bLUofAMoJaqnsS-lgKxGUCuW2c/od6/public/values?alt=json";

// initialize global listing data object
var listingsObj = {};

//
// Template Rendering Functions
//

// render template and return html content

function renderTemplate(source, data) {
  var template = Handlebars.compile(source);
  var content = template({ data: data });
  return content;
}

// render template and insert in target element

function replaceTemplate(target, source, data) {
  var template = Handlebars.compile(source);
  var content = template({ data: data });
  $(target).html(content);
}

// render template and append to target element

function appendTemplate(target, source, data) {
  var template = Handlebars.compile(source);
  var content = template({ data: data });
  $(target).append(content);
}

// clear element from DOM

function removeTemplate(target) {
  $(target).remove();
}

// display modal

function showModal(content) {
  // if there's already a modal
  if ($('.modal').length) {
    // replace the existing modal
    replaceTemplate($('.modal')[0], content);
  } else {
    // append a new modal to the body
    $('body').append(content);
  }
  // display modal
  $('.modal').modal('show');
}
//
// AJAX calls
//

// make AJAX call to JSON feed and return promise

function getListingData(path) {
  return $.ajax({
    url: path,
    cache: true
  });
}

// make AJAX call to Handlebars template file and return promise

function getTemplate(path) {
  return $.ajax({
    url: path,
    cache: true
  });
}

//  Submit Contact Form

function submitContact(data) {
  return $.ajax({
    url: "./cgi/submit.php",
    type: "POST",
    data: data,
    cache: false
  });
}

//
//  Listing Detail Functions
//

// get data from listingData array from mls number

function getDetailData(mls) {
  for (var i = 0; i < listingsObj.data.length; i++) {
    console.log(listingsObj.data[i]);
    if (listingsObj.data[i].mls == mls) {
      console.log(mls);
      return listingsObj.data[i];
    }
  }
}

// render and display listing detail in a full screen modal

function showDetails(mls) {
  getTemplate('js/templates/modal-detail.hbs').then(function (template) {
    var data = getDetailData(mls);
    var content = renderTemplate(template, data);
    showModal(content);
  }).fail(function (err) {
    return console.log('listing template is not available');
  });
}

// jQuery Gallery Setup

function setUpGallery() {
  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 210,
    itemMargin: 5,
    asNavFor: '#slider'
  });

  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel"
  });
}

//
//  Contact Form Modal Functions
//

function showContactForm() {
  getTemplate('js/templates/modal-contact.hbs').then(function (template) {
    var content = renderTemplate(template);
    showModal(content);
    // auto-format phone number on input
    $("#phone").mask("(999) 999-9999", { placeholder: " " });
  }).fail(function (err) {
    return console.log('contact template is not available');
  });
}

function showSubmitError() {
  getTemplate('js/templates/modal-submit-error.hbs').then(function (template) {
    var content = renderTemplate(template);
    showModal(content);
  }).fail(function (err) {
    return console.log('submit errror template is not available');
  });
}

function showSubmitSuccess() {
  getTemplate('js/templates/modal-submit-success.hbs').then(function (template) {
    var content = renderTemplate(template);
    showModal(content);
  }).fail(function (err) {
    return console.log('submit success template is not available');
  });
}
//
//  Event Handlers
//

function handleEvents() {
  // jQuery for page scrolling feature using jQuery Easing plugin
  $('a.page-scroll').bind('click', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - 75
    }, 800, 'easeInOutExpo');
    event.preventDefault();
  });

  // Highlight the top nav as page scrolls
  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 75
  });

  // Close the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function () {
    $('.navbar-toggle:visible').click();
  });

  // Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 75
    }
  });

  // show listing detail modal when "see more" is clicked
  $('.listings').on('click', '.see-more', function (e) {
    showDetails($(e.target).data('mls'));
  });

  // show contact form modal when button is clicked
  $('.contact-btn').click(function (e) {
    showContactForm();
  });

  // submit contact form
  $('body').on('submit', 'form#contact-form', function (event) {
    console.log('submit form');
    event.preventDefault();
    var name = $("input#firstName").val() + ' ' + $("input#lastName").val();
    var email = $("input#email").val();
    var phone = $("input#phone").val();
    var data = {
      name: name,
      email: email,
      phone: phone
    };
    submitContact(data).then(showSubmitSuccess).fail(showSubmitError);

    // reset form fields
    $("form#contact-form input").val('');
  });

  // initialize jquery gallery in detail modal
  $('body').on('shown.bs.modal', '#detail-modal', function () {
    setUpGallery();
  });

  // clear modal from DOM when closed
  $('body').on('hidden.bs.modal', '.modal', function () {
    removeTemplate('.modal');
  });
}

//
// Document Ready
//

$(function () {
  // set event handlers
  handleEvents();

  // get data from JSON feed and wait for promise to be returned
  getListingData(listingPath).then(function (data) {
    // set global listing object to JSON feed data
    listingsObj = new ListingData();
    listingsObj.setData(data.feed.entry);

    // get template and render
    getTemplate('js/templates/listings.hbs').then(function (template) {
      replaceTemplate('#listings', template, listingsObj.data);
    }).fail(function (err) {
      return console.log('listing template is not available');
    });
  }).fail(function (err) {
    return console.log('data feed is not available');
  });
});
//# sourceMappingURL=/Users/pliddy/Documents/dev/betterway/scripts.js.map