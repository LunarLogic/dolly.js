$(window).load(function () {
  var tableController = {
    onClone: function (el, cloneX, cloneY, indexX, indexY) {
      var row = $(el).closest('tr'),
          dirX = cloneX > 0 ? 1 : -1,
          dirY = cloneY > 0 ? 1 : -1,
          amountX = Math.abs(cloneX),
          amountY = Math.abs(cloneY);
      for (var i = indexY; amountY >= 0; i += dirY, amountY--) {
        var amX = amountX;
        for (var j = indexX; amX >= 0; j += dirX, amX--) {
          this.data[i][j] = this.data[indexY][indexX];
        }
      }

      this.render();
    },

    render:function () {
      var self = this;
      this.element.html("");
      for (var i = 0, len = this.data.length; i < len; i++) {
        var row = $("<tr></tr>");
        for (var j = 0, lenj = this.data[i].length; j < lenj; j++) {
          var cell = $("<td></td");
          cell.html(this.data[i][j]);
          row.append(cell);
        }
        this.element.append(row);
      }
      $("td").dolly({
        allowDiagonalSelection: true,
        cloned: function (event, ui) {
          self.onClone(this, ui.cloneX, ui.cloneY, ui.originX, ui.originY);
        },
        boxStyle: {
          "background-color": "rgba(255, 0, 0, 0.2)",
          border: "3px red dotted"
        },
        handleStyle: {
          width: "0",
          height: "0",
          "background-color": "transparent",
          "border-top": "7px solid transparent",
          "border-bottom": "7px solid black",
          "border-right": "7px solid black",
          "border-left": "7px solid transparent",
        },
      });
    }
  }

  tableController.element = $("<table></table>").appendTo("body");
  tableController.data = [];
  for (var i = 0; i < 6; i++) {
    tableController.data.push([]);
    for (var j = 0; j < 6; j++) {
      tableController.data[i].push(Math.floor(Math.random() * 100));
    }
  }
  tableController.render();
});
