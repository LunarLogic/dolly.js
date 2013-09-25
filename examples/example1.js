$(window).load(function () {
  var tableController = {
    onClone: function (el, cloneX, cloneY) {
      var row = $(el).closest('tr'),
          indexX = $(el).closest('tr').find('td').index(el),
          indexY = this.element.find('tr').index(row),
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
        cloned: function (event, ui) {
          self.onClone(this, ui.extendX, ui.extendY);
        },
        boxStyle: {
          "background-color": "rgba(255, 0, 0, 0.2)",
          border: "3px red dotted"
        }
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
