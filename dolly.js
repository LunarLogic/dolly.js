(function ($) {
  $.widget("llp.dolly", {
    options: {
      rowSelector: "tr",
      cellSelector: "td"
    },
    _create: function () {
      var self = this;
      this._box = $('<div class="dolly-box hidden"></div>');
      this._handle = $('<div class="dolly-handle hidden"></div>');
      this._wrapper = $('<div id="dolly-wrapper" style="position: relative; height: 100%; width: 100%; display: inline-block;"></div>');
      this._handle.css({right: -1 * parseInt(this.element.css("padding-right"), 10) - 2 + "px",
                        bottom: -1 * parseInt(this.element.css("padding-bottom"), 10) - 2 + "px"});
      this.element.wrapInner(this._wrapper);
      this._wrapper = this.element.find('div#dolly-wrapper');
      this._wrapper.append(this._box);
      this._wrapper.append(this._handle);

      this.element.hover(function () {
        self._handle.removeClass("hidden");
      }, function () {
        self._handle.addClass("hidden");
      });

      this._handle.on("mousedown", function (e) {
        self._initialX = e.pageX;
        self._initialY = e.pageY;
        self._box.removeClass("hidden");
        $("body").find(".dolly-handle").css({display: "none"});
        self._resetBoxSize();
        self._setTopLeftBoxPosition();
        $(window).disableSelection();
        $(window).on("mousemove", function (e) {
          self._handleDrag(e);
        });
      });

      $(window).on("mouseup", function () {
        self._box.addClass("hidden");
        $("body").find(".dolly-handle").css({display: ""});
        $(window).enableSelection();
        $(window).off("mousemove");
      });
    },

    _handleDrag: function (e) {
      this._resetBoxSize();
      if (Math.abs(e.pageX - this._initialX) > Math.abs(e.pageY - this._initialY)) {
        this._getCellsHorizontally(e.pageX);
      } else {
        this._getCellsVertically(e.pageY);
      }
    },

    _getCellsHorizontally: function (offset) {
      if (offset < this._initialX) {
        this._setBottomRightBoxPosition();
        this._getCellsLeft(this.element, offset);
      } else {
        this._setTopLeftBoxPosition();
        this._getCellsRight(this.element, offset);
      }
    },

    _getCellsVertically: function (offset) {
      if (offset < this._initialY) {
        this._setBottomRightBoxPosition();
        this._getCellsUp(this.element, offset);
      } else {
        this._setTopLeftBoxPosition();
        this._getCellsDown(this.element, offset);
      }
    },

    _getCellsUp: function (cell, offset) {
      var index = cell.closest(this.options.rowSelector).find(this.options.cellSelector).index(this.element);
      var cellInNextRow = $(cell.closest(this.options.rowSelector).prev(this.options.rowSelector).find(this.options.cellSelector).get(index));
      if (cell.length === 0) {
        return;
      }

      var cellWrapper = cell.find("#dolly-wrapper");

      var bottomCellEdge = cellWrapper.offset().top + cellWrapper.height() + parseInt(this.element.css("padding-top"), 10);
      var topCellEdge = cellWrapper.offset().top - parseInt(this.element.css("padding-top"), 10);

      if (offset < bottomCellEdge - 10) {
        this._box.height(this._box.offset().top + this._box.height() - topCellEdge + 2);
        this._getCellsUp(cellInNextRow, offset);
      }
    },

    _getCellsLeft: function (cell, offset) {
      var next = cell.prev(this.options.cellSelector);

      if (cell.length === 0) {
        return;
      }

      var cellWrapper = cell.find("#dolly-wrapper");

      var rightCellEdge = cellWrapper.offset().left + cellWrapper.width() + parseInt(this.element.css("padding-right"), 10);
      var leftCellEdge = cellWrapper.offset().left - parseInt(this.element.css("padding-left"), 10);

      if (offset < rightCellEdge - 10) {
        this._box.width(this._box.offset().left + this._box.width() - leftCellEdge + 2);
        this._getCellsLeft(next, offset);
      }

    },

    _getCellsRight: function (cell, offset) {
      var next = cell.next(this.options.cellSelector);
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
      var index = cell.closest(this.options.rowSelector).find(this.options.cellSelector).index(this.element);
      var cellInNextRow = $(cell.closest(this.options.rowSelector).next(this.options.rowSelector).find(this.options.cellSelector).get(index));
      if (cell.length === 0) {
        return;
      }

      var cellWrapper = cell.find("#dolly-wrapper");

      var bottomCellEdge = cellWrapper.offset().top + cellWrapper.height() + parseInt(this.element.css("padding-top"), 10);

      if (offset > cell.offset().top + 10) {
        this._box.height(bottomCellEdge - this._box.offset().top - 2);
        this._getCellsDown(cellInNextRow, offset);
      }
    },

    _resetBoxSize: function () {
      this._box.width(this._wrapper.width() + this._getCssParameter("padding-left") + this._getCssParameter("padding-right"));
      this._box.height(this._wrapper.innerHeight() + this._getCssParameter("padding-top") + this._getCssParameter("padding-bottom"));
    },

    _setTopLeftBoxPosition: function () {
      this._box.css({ top: -1 * this._getCssParameter("padding-top") - 2 + "px",
                      left: -1 * this._getCssParameter("padding-left") -2 +"px",
                      bottom: "",
                      right: "" });
    },

    _setBottomRightBoxPosition: function () {
      this._box.css({ bottom: -1 * this._getCssParameter("padding-bottom") - 2 + "px",
                      right: -1 * this._getCssParameter("padding-right") -2 +"px",
                      top: "",
                      left: "" });
    },


    _getCssParameter: function (param) {
      return parseInt(this.element.css(param), 10);
    }


  });
}(jQuery));
