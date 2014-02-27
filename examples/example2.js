$(window).load(function () {
  var tableController = {
    onClone: function (el, cloneX, cloneY) {
      var currentCell = $(el),
          currentRow = currentCell.parent(),
          index = currentCell.index(),
          nextCellMethod = cloneX > 0 ? "next" : "prev",
          nextRowMethod = cloneY > 0 ? "next" : "prev",
          amountX = Math.abs(cloneX),
          amountY = Math.abs(cloneY);

      for (var row = currentRow; amountY >= 0; row = row[nextRowMethod](), amountY--) {
        var amX = amountX;
        for (var cell = row.find('td').eq(index); amX >= 0; cell = cell[nextCellMethod](), amX--) {
          cell.css({"background-color": currentCell.css("background-color")});
        }
      }
    },

    setRandomColors: function () {
      var rand = function () {
        return Math.floor(Math.random() * 255);
      }

      this.element.find("tr").each(function () {
        $(this).find("td").each(function () {
          $(this).css({"background-color": 'rgb(' + rand() + ', ' + rand() + ', ' + rand() + ')'});
        });
      });
    },

    render:function () {
      var self = this;

      this.element.html("");

      for (var i = 0; i < 5; i++) {
        var row = $("<tr></tr>");
        for (var j = 0; j < 5; j++) {
          row.append($("<td></td>"));
        }
        this.element.append(row);
      }

      $("td").dolly({
        allowDiagonalSelection: false,
        cloned: function (event, ui) {
          self.onClone(this, ui.cloneX, ui.cloneY);
        },
      });

      this.setRandomColors();
    }
  }

  tableController.element = $("<table></table>").appendTo("body");
  tableController.render();
});

