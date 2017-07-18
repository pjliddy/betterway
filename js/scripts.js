$(function() {
  var data = getListings();

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $('a.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: ($($anchor.attr('href')).offset().top - 50)
      }, 800, 'easeInOutExpo');
      event.preventDefault();
  });

  // Highlight the top nav as scrolling occurs
  $('body').scrollspy({
      target: '.navbar-fixed-top',
      offset: 51
  });

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function(){
          $('.navbar-toggle:visible').click();
  });

  // Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 100
    }
  });
});

function getTemplate (target, path, data) {
  $.ajax({
    url: path, //ex. js/templates/mytemplate.handlebars
      cache: true,
      success: function(res) {
        renderTemplate(target, res, data);
    }
  });
}

function renderTemplate(target, source, data) {
  var template  = Handlebars.compile(source);
  var content = template({listings:data});
  $(target).html(content);
}

function getListings() {
  var data;
  var path = "https://spreadsheets.google.com/feeds/list/1hzXzXdK1fqgaZC_eQdxLRFkUOHlW7puy9w9CPrNl5uE/od6/public/values?alt=json";

  $.ajax({
    url: path,
      cache: true,
      success: function(res) {
        data = res.feed.entry;
        getTemplate('#listing-active','js/templates/listing-active.hbs', data);
    }
  });
}
