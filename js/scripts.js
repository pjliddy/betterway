$(function(){
  var data = getListings();
  getTemplate('#listing-active','js/templates/listing-active.hbs', data);
  getTemplate('#listing-sold','js/templates/listing-sold.hbs', data);

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
  };
});

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
      mls: "8203214",
      address: "1334 Garrick Way",
      city: "Marietta",
      county: "Cobb",
      state: "GA",
      zip: "30068",
      type: "Single Family",
      price: "725,000",
      status: "active",
      num_bedrooms: "5",
      num_bathrooms: "4",
      year_built: "1990",
      cooling: "Ceiling Fan, Central",
      cooling_source: "Electric",
      heating_type: "Forced Air",
      heating_source: "Gas",
      description: "Completely updated MAGNIFICENT East Cobb 5BR/4BA Exec. home in sought after Camden Place. Kitchen includes faux-painted cabinets, granite cntps, and SS appliances. Huge Master Bath has been completely renovated with granite cntps and rainforest, open-air double shower. Large FIN Terrace level is an entertainer's dream with media room, family room, full bath and Bedroom. Large fenced in BYD and one of only a handful of homes with a view of the lake. Active Swim/Tennis community along with award winning schools! This home is move-in ready!",
      images: [
        "8203214-1.jpg",
        "8203214-1.jpg",
        "8203214-2.jpg",
        "8203214-3.jpg",
        "8203214-4.jpg",
        "8203214-5.jpg",
        "8203214-6.jpg",
        "8203214-7.jpg",
        "8203214-8.jpg",
        "8203214-9.jpg"]
    },
    {
      address: '5171 Ivy Green Way',
      city: 'Mableton',
      state: 'TX',
      zip: '30126',
      mls: '8185608',
      type: 'Single Family',
      status: 'Available',
      price: '879,000'
    },
    {
      address: '41 Red Oak Cir',
      city: 'Dallas',
      state: 'TX',
      zip: '30157',
      mls: '8176878',
      status: 'Available',
      type: 'Single Family',
      price: '196,500'
    },
    {
      address: '319 Hunters, #167',
      city: 'Dallas',
      state: 'TX',
      zip: '30157',
      mls: '8176878',
      status: 'Available',
      type: 'Single Family',
      price: '279,600'
    },
    {
      address: '1313 Mockingbird Way',
      city: 'Galveston',
      state: 'TX',
      zip: '30122',
      mls: '8188728',
      status: 'Available',
      type: 'Single Family',
      price: '479,000'
    },
    {
      address: '12 Green Oak Drive',
      city: 'Austin',
      state: 'TX',
      zip: '30133',
      mls: '8185608',
      status: 'Available',
      type: 'Single Family',
      price: '212,500'
    }

  ];

  return data;
}
