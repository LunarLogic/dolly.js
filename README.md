Dolly.js - Clone your tables easily
===================================

Dolly.js is a simple and generic jQuery UI widget that adds excel-like cloning functionality to your tables. It works with any tabular structure (not only semantic html tables) and does not make any assumptions about the underlying data structure. It handles the UI part of cloning only - the implementation of business cloning logic is left to the widget's users.

Usage
-----

Call the `dolly` method on every table cell that should have cloning functionality. Then listen on `cloned` event to handle the data-related part of cloning.

```
$('td').dolly({
  cloned: function (event, ui) {
    console.log(this, "has been cloned " + ui.cloneX + " cells horizontally and " + ui.cloneY + " vertically.");
  }
});
```
You can find more elaborate examples in the `examples` directory.

Options
-------

#### allowDiagonalSelection

Enable possiblity to select cells in an area. Defaults to `false`. Example:

```
$(cell).dolly({
  allowDiagonalSelection: true,
  rowSelector: 'div.row',
  cellSelector: 'div.cell'
});
```

will make possible to select a group of cells like this:

![cloning an area of cells](https://raw.github.com/LunarLogic/dolly.js/master/examples/imgs/area_selection.png)

#### rowSelector

jQuery selector for elements that should be considered the rows of the table. Defaults to `"tr"`. Example:

```
$(cell).dolly({
  rowSelector: 'div.row',
  cellSelector: 'div.cell'
});
```

#### cellSelector

jQuery selector for elements that should be considered the cells of the table. Defaults to `"td"`. Example:

```
$(cell).dolly({
  rowSelector: 'div.row',
  cellSelector: 'div.cell'
});
```
#### boxStyle

Object with custom CSS styles assigned to the selection box displayed when user clones cells. For example:

```
$(cell).dolly({
  boxStyle: {
    "background-color": "rgba(255, 0, 0, 0.2)",
     border: "3px red dotted"
  }
});
```
will result in a selection box like this:

![red clone box](http://blog.lunarlogic.io/wp-content/uploads/redbox.png)

You can also style this with CSS `dolly-box` class.

#### handleStyle

Object with custom CSS styles assigned to the handle of the cloning box.

```
$(cell).dolly({
  handleStyle: {
    width: "0",
    height: "0",
    "background-color": "transparent",
    "border-top": "7px solid transparent",
    "border-left": "7px solid transparent",
    "border-bottom": "7px solid black",
    "border-right": "7px solid black",
    }
  }
});
```

will result in a triangular handle like this:

![triangular dolly handle](http://blog.lunarlogic.io/wp-content/uploads/triangular-dolly-handle.png)

You can also style this with CSS `dolly-handle` class.

Events
------

In all event callbacks `this` is bound to the origin HTML cell element.

#### Contents of `ui` object

The `ui` object is passed as the second argument to every callback. It contains:

* `originX` - position of cell in row that triggered the event (0-indexed).
* `originY` - position of row containing cell that triggered the event (0-indexed).
* `cloneX` - number of cells selected for cloning horizontally. Negative values stand for cloning to the left, positive to the right.
* `cloneY` - number of cells selected for cloning vertically. Negative values stand for cloning up, positive for cloning down.

#### cloned

Triggered whenever user requests cloning of a cell. You can pass a callback during dolly initialization like this:

```
$(cell).dolly({
  cloned: function (event, ui) {
    ...
  }
});
```

or listen on `dollycloned` event:

```
$(cell).dolly().on('dollycloned', function (event, ui) {...});
```

#### selected

Triggered whenever the size of selection box changes. This does not mean a clone request, just a user moving the handle. After user releases the handle, `cloned` event is triggered.

Once again you can pass a callback directly or listen on `dollyselected` event.
