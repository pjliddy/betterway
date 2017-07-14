$(function(){
  var data = getListings();
  getTemplate('#listings','js/templates/listing.hbs', data);

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
})
})

function getTemplate(target, path, data) {
  var source;
  var template;

  $.ajax({
    url: path, //ex. js/templates/mytemplate.handlebars
      cache: true,
      success: function(res) {
        // source    = res;
        // template  = Handlebars.compile(source);
        // $('#target').html(template);
        // console.log(template());
        renderTemplate(target, res, data);
    }
  });
}

function renderTemplate(target, source, data) {
  console.log(data);

  const template  = Handlebars.compile(source);
  const content = template({listings:data});
  $(target).html(content);
}

function getListings() {
  data = [
    {
      address: '319 Hunters, #167',
      city: 'Dallas',
      state: 'TX',
      zip: '30157',
      mls: '8188728',
      type: 'Single Family',
      price: '249,900'
    },
    {
      address: '5171 Ivy Green Way',
      city: 'Mableton',
      state: 'TX',
      zip: '30126',
      mls: '8185608',
      type: 'Single Family',
      price: '879,000'
    },
    {
      address: '41 Red Oak Cir',
      city: 'Dallas',
      state: 'TX',
      zip: '30157',
      mls: '8176878',
      type: 'Single Family',
      price: '196,500'
    },
    {
      address: '319 Hunters, #167',
      city: 'Dallas',
      state: 'TX',
      zip: '30157',
      mls: '8176878',
      type: 'Single Family',
      price: '279,600'
    },
    {
      address: '1313 Mockingbird Way',
      city: 'Galveston',
      state: 'TX',
      zip: '30122',
      mls: '8188728',
      type: 'Single Family',
      price: '479,000'
    },
    {
      address: '12 Green Oak Drive',
      city: 'Austin',
      state: 'TX',
      zip: '30133',
      mls: '8185608',
      type: 'Single Family',
      price: '212,500'
    }

  ];

  return data;
}
