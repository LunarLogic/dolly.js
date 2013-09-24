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
      this._handle.css({right: -1 * this._getCssAsNumber("padding-right") - 2 + "px",
                        bottom: -1 * this._getCssAsNumber("padding-bottom") - 2 + "px"});
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
        self._extendX = 0;
        self._extendY = 0;
        self._box.removeClass("hidden");
        $("body").find(".dolly-handle").css({display: "none"});
        self._resetBoxSize();
        self._setTopLeftBoxPosition();

        $(window).disableSelection();

        var mouseMoveListener = function (e) {
          self._handleDrag(e);
        }

        var mouseUpListener = function () {
          self._box.addClass("hidden");
          $("body").find(".dolly-handle").css({display: ""});
          $(window).enableSelection();
          $(window).off("mousemove", mouseMoveListener);
          $(window).off("mouseup", mouseUpListener);
          self._trigger("cloned", null, { extendX: self._extendX,
                                          extendY: self._extendY });
        }

        $(window).on("mousemove", mouseMoveListener);
        $(window).on("mouseup", mouseUpListener);
      });

    },

    _handleDrag: function (e) {
      this._resetBoxSize();
      this._extendX = 0;
      this._extendY = 0;
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
      var next = $(cell.closest(this.options.rowSelector).prev(this.options.rowSelector).find(this.options.cellSelector).get(index));

      if (next.length === 0 || offset > this._getCellEdges(next).bottom - 10) {
        return;
      }

      this._extendY -= 1;
      this._box.height(this._box.offset().top + this._box.height() - this._getCellEdges(next).top + 2);
      this._getCellsUp(next, offset);
    },

    _getCellsLeft: function (cell, offset) {
      var next = cell.prev(this.options.cellSelector);

      if (next.length === 0 || offset > this._getCellEdges(next).right - 10) {
        return;
      }

      this._extendX -= 1;
      this._box.width(this._box.offset().left + this._box.width() - this._getCellEdges(next).left + 2);
      this._getCellsLeft(next, offset);
    },

    _getCellsRight: function (cell, offset) {
      var next = cell.next(this.options.cellSelector);

      if (next.length === 0 || offset < next.offset().left + 10) {
        return;
      }

      this._extendX += 1;
      this._box.width(this._getCellEdges(next).right - this._box.offset().left - 2);
      this._getCellsRight(next, offset);
    },

    _getCellsDown: function (cell, offset) {
      var index = cell.closest(this.options.rowSelector).find(this.options.cellSelector).index(this.element);
      var next = $(cell.closest(this.options.rowSelector).next(this.options.rowSelector).find(this.options.cellSelector).get(index));

      if (next.length === 0 || offset < next.offset().top + 10) {
        return;
      }

      this._extendY += 1;
      this._box.height(this._getCellEdges(next).bottom - this._box.offset().top - 2);
      this._getCellsDown(next, offset);
    },

    _resetBoxSize: function () {
      this._box.width(this._getCellSize().width);
      this._box.height(this._getCellSize().height);
    },

    _setTopLeftBoxPosition: function () {
      this._box.css({ top: -1 * this._getCssAsNumber("padding-top") - 2 + "px",
                      left: -1 * this._getCssAsNumber("padding-left") -2 +"px",
                      bottom: "",
                      right: "" });
    },

    _setBottomRightBoxPosition: function () {
      this._box.css({ bottom: -1 * this._getCssAsNumber("padding-bottom") - 2 + "px",
                      right: -1 * this._getCssAsNumber("padding-right") -2 +"px",
                      top: "",
                      left: "" });
    },

    _getCellEdges: function (cell) {
      var wrapper = cell.find("#dolly-wrapper");
      return {
        top: wrapper.offset().top - this._getCssAsNumber("padding-top", cell),
        bottom: wrapper.offset().top + wrapper.height() + this._getCssAsNumber("padding-bottom", cell),
        left: wrapper.offset().left - this._getCssAsNumber("padding-left", cell),
        right: wrapper.offset().left + wrapper.width() + this._getCssAsNumber("padding-right", cell)
      };
    },

    _getCellSize: function (cell) {
      cell = cell || this.element;
      var wrapper = cell.find("#dolly-wrapper");
      return {
        width: this._getCssAsNumber("padding-left", cell) + this._getCssAsNumber("padding-right", cell) + wrapper.width(),
        height: this._getCssAsNumber("padding-top", cell) + this._getCssAsNumber("padding-bottom", cell) + wrapper.height()
      };
    },

    _getCssAsNumber: function (param, elem) {
      elem = elem || this.element;
      return parseInt(elem.css(param), 10);
    }

  });
}(jQuery));
