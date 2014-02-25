(function ($) {
  $.widget("llp.dolly", {
    options: {
      rowSelector: "tr",
      cellSelector: "td",
      boxStyle: {
        border: "2px dotted black"
      },
      handleStyle: {
        width: "8px",
        height: "8px",
        "background-color": "black",
        cursor: "crosshair"
      }
    },

    _boxStyle: {
      position: "absolute",
      width: "100%",
      height: "100%",
      "z-index": "1000",
      visibility: "hidden"
    },

    _handleStyle: {
      position: "absolute",
      visibility: "hidden"
    },

    _wrapperStyle: {
      position: "relative",
      height: "100%",
      width: "100%",
      display: "inline-block"
    },

    _create: function () {
      this._createElements();

      this._boxBorder = this._getCssAsNumber("border-width", this.elements.box);

      this._bindEvents();
    },

    _createElements: function() {
      this.elements = {};

      this.elements.box = $('<div class="dolly-box"></div>');
      this.elements.handle = $('<div class="dolly-handle"></div>');
      this.elements.wrapper = $('<div id="dolly-wrapper"></div>');

      this.elements.wrapper.css(this._wrapperStyle);
      this.elements.handle.css(this._processHandleStyle());
      this.elements.box.css(this._processBoxStyle());

      this.element.wrapInner(this.elements.wrapper);
      this.elements.wrapper.append(this.elements.box);
      this.elements.wrapper.append(this.elements.handle);
    },

    _processHandleStyle: function() {
      return $.extend({
          right: -1 * this._getCssAsNumber("padding-right") + "px",
          bottom: -1 * this._getCssAsNumber("padding-bottom") + "px"
        },
        this._handleStyle,
        this.options.handleStyle);
    },

    _processBoxStyle: function() {
      return $.extend({}, this._boxStyle, this.options.boxStyle);
    },

    _bindEvents: function() {
      var self = this;

      this.element.hover(function () {
        self.elements.handle.css({visibility: "visible"});
      }, function () {
        self.elements.handle.css({visibility: "hidden"});
      });

      this.elements.handle.on("mousedown", function (e) {
        self._initialX = e.pageX;
        self._initialY = e.pageY;
        self._cloneX = 0;
        self._cloneY = 0;

        self.elements.box.css({visibility: "visible"});
        self.elements.handle.css({display: "none"});

        self._resetBoxSize();
        self._setTopLeftBoxPosition();

        $(window).disableSelection();

        var mouseMoveListener = function (e) {
          self._handleDrag(e);
        }

        var mouseUpListener = function () {
          self.elements.box.css({visibility: "hidden"});
          self.elements.handle.css({display: ""});

          $(window).enableSelection();
          $(window).off("mousemove", mouseMoveListener);
          $(window).off("mouseup", mouseUpListener);
          self._trigger("cloned", null, { cloneX: self._cloneX,
                                          cloneY: self._cloneY,
                                          originX: self._getOriginX(),
                                          originY: self._getOriginY() });
        }

        $(window).on("mousemove", mouseMoveListener);
        $(window).on("mouseup", mouseUpListener);
      });
    },

    _handleDrag: function (e) {
      this._resetBoxSize();
      var prevcloneX = this._cloneX;
      var prevcloneY = this._cloneY;
      this._cloneX = 0;
      this._cloneY = 0;

      if (Math.abs(e.pageX - this._initialX) > Math.abs(e.pageY - this._initialY)) {
        this._getCellsHorizontally(e.pageX);
      } else {
        this._getCellsVertically(e.pageY);
      }
      if (prevcloneX !== this._cloneX || prevcloneY !== this._cloneY) {
        this._trigger("selected", null, { cloneX: this._cloneX,
                                          cloneY: this._cloneY,
                                          originX: this._getOriginX(),
                                          originY: this._getOriginY() });
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

      this._cloneY -= 1;
      this.elements.box.height(this.elements.box.offset().top + this.elements.box.height() - this._getCellEdges(next).top + this._boxBorder);
      this._getCellsUp(next, offset);
    },

    _getCellsLeft: function (cell, offset) {
      var next = cell.prev(this.options.cellSelector);

      if (next.length === 0 || offset > this._getCellEdges(next).right - 10) {
        return;
      }

      this._cloneX -= 1;
      this.elements.box.width(this.elements.box.offset().left + this.elements.box.width() - this._getCellEdges(next).left + this._boxBorder);
      this._getCellsLeft(next, offset);
    },

    _getCellsRight: function (cell, offset) {
      var next = cell.next(this.options.cellSelector);

      if (next.length === 0 || offset < next.offset().left + 10) {
        return;
      }

      this._cloneX += 1;
      this.elements.box.width(this._getCellEdges(next).right - this.elements.box.offset().left - this._boxBorder);
      this._getCellsRight(next, offset);
    },

    _getCellsDown: function (cell, offset) {
      var index = cell.closest(this.options.rowSelector).find(this.options.cellSelector).index(this.element);
      var next = $(cell.closest(this.options.rowSelector).next(this.options.rowSelector).find(this.options.cellSelector).get(index));

      if (next.length === 0 || offset < next.offset().top + 10) {
        return;
      }

      this._cloneY += 1;
      this.elements.box.height(this._getCellEdges(next).bottom - this.elements.box.offset().top - this._boxBorder);
      this._getCellsDown(next, offset);
    },

    _resetBoxSize: function () {
      this.elements.box.width(this._getCellSize().width);
      this.elements.box.height(this._getCellSize().height);
    },

    _setTopLeftBoxPosition: function () {
      this.elements.box.css({ top: -1 * this._getCssAsNumber("padding-top") - this._boxBorder + "px",
                      left: -1 * this._getCssAsNumber("padding-left") - this._boxBorder + "px",
                      bottom: "",
                      right: "" });
    },

    _setBottomRightBoxPosition: function () {
      this.elements.box.css({ bottom: -1 * this._getCssAsNumber("padding-bottom") - this._boxBorder + "px",
                      right: -1 * this._getCssAsNumber("padding-right") - this._boxBorder + "px",
                      top: "",
                      left: "" });
    },

    _getCellEdges: function (cell) {
      var wrapper = this.elements.wrapper;
      return {
        top: wrapper.offset().top - this._getCssAsNumber("padding-top", cell),
        bottom: wrapper.offset().top + wrapper.height() + this._getCssAsNumber("padding-bottom", cell),
        left: wrapper.offset().left - this._getCssAsNumber("padding-left", cell),
        right: wrapper.offset().left + wrapper.width() + this._getCssAsNumber("padding-right", cell)
      };
    },

    _getCellSize: function (cell) {
      cell = cell || this.element;
      var wrapper = this.elements.wrapper;
      return {
        width: this._getCssAsNumber("padding-left", cell) + this._getCssAsNumber("padding-right", cell) + wrapper.width(),
        height: this._getCssAsNumber("padding-top", cell) + this._getCssAsNumber("padding-bottom", cell) + wrapper.height()
      };
    },

    _getCssAsNumber: function (param, elem) {
      elem = elem || this.element;
      return parseInt(elem.css(param), 10);
    },

    _getOriginX: function () {
      return this.element.closest(this.options.rowSelector).find(this.options.cellSelector).index(this.element);
    },

    _getOriginY: function () {
      var row = this.element.closest(this.options.rowSelector);
      return row.parent().find(this.options.rowSelector).index(row);
    }
  });
}(jQuery));
