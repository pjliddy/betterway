$(function(){
  var data = getListings();
  getTemplate('#test','js/templates/listing.hbs', data);
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
    }
  ];

  return data;
}
