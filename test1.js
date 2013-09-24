$(window).load(function () {
  $('td').dolly({
    handleStyle: {
      width: '15px',
      height: '10px',
      "background-color": "rgba(0, 0, 0, 0.5)",
      cursor: "pointer"
    },
    boxStyle: {
      border: "5px dotted black",
    },
  }).on('dollycloned', function (event, ui) {
    console.log(ui);
  }).on('dollyselected', function (event, ui) {
    console.log("select", ui);
  });
});

