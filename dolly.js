(function ($) {
  $.widget("llp.dolly", {
    _wrapper: null,
    _handle: null,
    _create: function () {
      var self = this;
      this.wrapper = $('<div class="dolly-box hidden"></div>');
      this.handle = $('<div class="dolly-handle"></div>');
      this.element.css({position: "relative"});
      this.element.append(this.wrapper);
      this.element.append(this.handle);

      this.handle.on("mousedown", function () {
        self.wrapper.removeClass("hidden");
        $(window).disableSelection();
        $(window).on("mousemove", function (e) {
          self._handleDrag(e);
        });
      });

      $(window).on("mouseup", function () {
        self.wrapper.addClass("hidden");
        $(window).enableSelection();
        $(window).off("mousemove");
      });
    },

    _handleDrag: function (e) {
      console.log(e);
    }

  });
}(jQuery));
