(function ($) {
  $.widget("llp.dolly", {
    _box: null,
    _handle: null,
    _initialX: 0,
    _initialY: 0,
    _create: function () {
      var self = this;
      this._box = $('<div class="dolly-box hidden"></div>');
      this._handle = $('<div class="dolly-handle"></div>');
      this._wrapper = $('<div id="dolly-wrapper" style="position: relative; height: 100%; width: 100%; display: inline-block;"></div>');
      this.element.wrapInner(this._wrapper);
      this._wrapper = this.element.find('div');
      this._wrapper.append(this._box);
      this._wrapper.append(this._handle);

      this._handle.on("mousedown", function (e) {
        self._initialX = e.pageX;
        self._initialY = e.pageY;
        self._box.removeClass("hidden");
        $(window).disableSelection();
        $(window).on("mousemove", function (e) {
          self._handleDrag(e);
        });
      });

      $(window).on("mouseup", function () {
        self._box.addClass("hidden");
        self._box.css("width", "");
        $(window).enableSelection();
        $(window).off("mousemove");
      });
    },

    _handleDrag: function (e) {
      this._box.css({width: "", height: ""});
      if (e.pageX - this._initialX > e.pageY - this._initialY) {
        this._getCellsRight(this.element, e.pageX);
      } else {
        this._getCellsDown(this.element, e.pageY);
      }
    },

    _getCellsRight: function (cell, offset) {
      var next = cell.next("td");
      if (cell.length === 0) {
        return;
      }

      var cellWrapper = cell.find("#dolly-wrapper");

      var rightCellEdge = cellWrapper.offset().left + cellWrapper.width() + parseInt(this.element.css("padding-right"), 10);

      if (offset > cell.offset().left + 10) {
        this._box.width(rightCellEdge - this._box.offset().left - 2);
        this._getCellsRight(next, offset);
      }
    },

    _getCellsDown: function (cell, offset) {
      var index = cell.closest("tr").find("td").index(this.element);
      var cellInNextRow = $(cell.closest("tr").next("tr").find("td").get(index));
      if (cell.length === 0) {
        return;
      }

      var cellWrapper = cell.find("#dolly-wrapper");

      var bottomCellEdge = cellWrapper.offset().top + cellWrapper.height() + parseInt(this.element.css("padding-top"), 10);

      if (offset > cell.offset().top + 10) {
        this._box.height(bottomCellEdge - this._box.offset().top - 2);
        this._getCellsDown(cellInNextRow, offset);
      }
    }


  });
}(jQuery));
