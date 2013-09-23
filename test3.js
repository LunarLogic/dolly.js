$(window).load(function () {
  $('.cell').dolly({
    rowSelector: ".row",
    cellSelector: ".cell",
    extended: function (event, ui) {
      console.log(ui);
    }
  });
});
