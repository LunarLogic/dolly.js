$(window).load(function () {
  $('td').dolly().on('dollyextended', function (event, ui) {
    console.log(ui);
  });
});

