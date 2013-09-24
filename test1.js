$(window).load(function () {
  $('td').dolly().on('dollycloned', function (event, ui) {
    console.log(ui);
  });
});

