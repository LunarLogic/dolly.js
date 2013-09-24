$(window).load(function () {
  $('.cell').dolly({
    rowSelector: ".row",
    cellSelector: ".cell",
    cloned: function (event, ui) {
      console.log(ui);
    }
  });
});
