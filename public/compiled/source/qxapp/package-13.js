(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.Part": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The part loader knows about all generated packages and parts.
   *
   * It contains functionality to load parts and to retrieve part instances.
   */
  qx.Class.define("qx.io.PartLoader", {
    type: "singleton",
    extend: qx.core.Object,
    construct() {
      qx.core.Object.constructor.call(this);
      var loader = this._loader = qx.Part.getInstance();
      var self = this;
      loader.onpart = function (part) {
        if (part.getReadyState() == "complete") {
          self.fireDataEvent("partLoaded", part);
        } else {
          self.fireDataEvent("partLoadingError", part.getName());
        }
      };
    },
    events: {
      /**
       * Fired if a parts was loaded. The data of the event instance point to the
       * loaded part instance.
       */
      partLoaded: "qx.event.type.Data",
      /**
       * Fired if a part could not be loaded. The event's
       * {@link qx.event.type.Data#getData} method returns the name of the failed
       * part.
       */
      partLoadingError: "qx.event.type.Data"
    },
    statics: {
      /**
       * Loads one or more parts asynchronously. The callback is called after all
       * parts and their dependencies are fully loaded. If the parts are already
       * loaded the callback is called immediately.
       *
       * @param partNames {String[]} List of parts names to load as defined in the
       *    config file at compile time.
       * @param callback {Function} Function to execute on completion.
       *   The function has one parameter which is an array of ready states of
       *   the parts specified in the partNames argument.
       * @param self {Object?window} Context to execute the given function in
       */
      require(partNames, callback, self) {
        this.getInstance().require(partNames, callback, self);
      }
    },
    members: {
      /**
       * Loads one or more parts asynchronously. The callback is called after all
       * parts and their dependencies are fully loaded. If the parts are already
       * loaded the callback is called immediately.
       *
       * @param partNames {String|String[]} List of parts names to load as defined
       *    in the config file at compile time. The method also accepts a single
       *    string as parameter to only load one part.
       * @param callback {Function} Function to execute on completion
       * @param self {Object?window} Context to execute the given function in
       */
      require(partNames, callback, self) {
        this._loader.require(partNames, callback, self);
      },
      /**
       * Get the part instance of the part with the given name.
       *
       * @param name {String} Name of the part as defined in the config file at
       *    compile time.
       * @return {qx.io.part.Part} The corresponding part instance
       */
      getPart(name) {
        return this.getParts()[name];
      },
      /**
       * Checks if a part with the given name is available.
       * @param name {String} Name of the part as defined in the config file at
       *    compile time.
       * @return {Boolean} <code>true</code>, if the part is available
       */
      hasPart(name) {
        return this.getPart(name) !== undefined;
      },
      /**
       * Returns a map of all known parts.
       * @return {Map} Map containing all parts.
       */
      getParts() {
        return this._loader.getParts();
      }
    }
  });
  qx.io.PartLoader.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christian Hagendorn (chris_schmidt)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Each object, which should support single selection have to
   * implement this interface.
   */
  qx.Interface.define("qx.ui.core.ISingleSelection", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fires after the selection was modified */
      changeSelection: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Returns an array of currently selected items.
       *
       * Note: The result is only a set of selected items, so the order can
       * differ from the sequence in which the items were added.
       *
       * @return {qx.ui.core.Widget[]} List of items.
       */
      getSelection() {
        return true;
      },
      /**
       * Replaces current selection with the given items.
       *
       * @param items {qx.ui.core.Widget[]} Items to select.
       * @throws {Error} if the item is not a child element.
       */
      setSelection(items) {
        return arguments.length == 1;
      },
      /**
       * Clears the whole selection at once.
       */
      resetSelection() {
        return true;
      },
      /**
       * Detects whether the given item is currently selected.
       *
       * @param item {qx.ui.core.Widget} Any valid selectable item
       * @return {Boolean} Whether the item is selected.
       * @throws {Error} if the item is not a child element.
       */
      isSelected(item) {
        return arguments.length == 1;
      },
      /**
       * Whether the selection is empty.
       *
       * @return {Boolean} Whether the selection is empty.
       */
      isSelectionEmpty() {
        return true;
      },
      /**
       * Returns all elements which are selectable.
       *
       * @param all {Boolean} true for all selectables, false for the
       *   selectables the user can interactively select
       * @return {qx.ui.core.Widget[]} The contained items.
       */
      getSelectables(all) {
        return arguments.length == 1;
      }
    }
  });
  qx.ui.core.ISingleSelection.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {},
      "qx.ui.core.SingleSelectionManager": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * This mixin links all methods to manage the single selection.
   *
   * The class which includes the mixin has to implements two methods:
   *
   * <ul>
   * <li><code>_getItems</code>, this method has to return a <code>Array</code>
   *    of <code>qx.ui.core.Widget</code> that should be managed from the manager.
   * </li>
   * <li><code>_isAllowEmptySelection</code>, this method has to return a
   *    <code>Boolean</code> value for allowing empty selection or not.
   * </li>
   * </ul>
   */
  qx.Mixin.define("qx.ui.core.MSingleSelectionHandling", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fires after the value was modified */
      changeValue: "qx.event.type.Data",
      /** Fires after the selection was modified */
      changeSelection: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** @type {qx.ui.core.SingleSelectionManager} the single selection manager */
      __manager__P_59_0: null,
      /*
      ---------------------------------------------------------------------------
        PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * setValue implements part of the {@link qx.ui.form.IField} interface.
       *
       * @param item {null|qx.ui.core.Widget} Item to set as selected value.
       * @returns {null|TypeError} The status of this operation.
       */
      setValue(item) {
        if (null === item) {
          this.resetSelection();
          return null;
        }
        if (item instanceof qx.ui.core.Widget) {
          this.__getManager__P_59_1().setSelected(item);
          return null;
        } else {
          return new TypeError("Given argument is not null or a {qx.ui.core.Widget}.");
        }
      },
      /**
       * getValue implements part of the {@link qx.ui.form.IField} interface.
       *
       * @returns {null|qx.ui.core.Widget} The currently selected widget or null if there is none.
       */
      getValue() {
        return this.__getManager__P_59_1().getSelected() || null;
      },
      /**
       * resetValue implements part of the {@link qx.ui.form.IField} interface.
       */
      resetValue() {
        this.__getManager__P_59_1().resetSelected();
      },
      /**
       * Returns an array of currently selected items.
       *
       * Note: The result is only a set of selected items, so the order can
       * differ from the sequence in which the items were added.
       *
       * @return {qx.ui.core.Widget[]} List of items.
       */
      getSelection() {
        var selected = this.__getManager__P_59_1().getSelected();
        if (selected) {
          return [selected];
        } else {
          return [];
        }
      },
      /**
       * Replaces current selection with the given items.
       *
       * @param items {qx.ui.core.Widget[]} Items to select.
       * @throws {Error} if one of the items is not a child element and if
       *    items contains more than one elements.
       */
      setSelection(items) {
        switch (items.length) {
          case 0:
            this.resetSelection();
            break;
          case 1:
            this.__getManager__P_59_1().setSelected(items[0]);
            break;
          default:
            throw new Error("Could only select one item, but the selection array contains " + items.length + " items!");
        }
      },
      /**
       * Clears the whole selection at once.
       */
      resetSelection() {
        this.__getManager__P_59_1().resetSelected();
      },
      /**
       * Detects whether the given item is currently selected.
       *
       * @param item {qx.ui.core.Widget} Any valid selectable item.
       * @return {Boolean} Whether the item is selected.
       * @throws {Error} if one of the items is not a child element.
       */
      isSelected(item) {
        return this.__getManager__P_59_1().isSelected(item);
      },
      /**
       * Whether the selection is empty.
       *
       * @return {Boolean} Whether the selection is empty.
       */
      isSelectionEmpty() {
        return this.__getManager__P_59_1().isSelectionEmpty();
      },
      /**
       * Returns all elements which are selectable.
       *
       * @param all {Boolean} true for all selectables, false for the
       *   selectables the user can interactively select
       * @return {qx.ui.core.Widget[]} The contained items.
       */
      getSelectables(all) {
        return this.__getManager__P_59_1().getSelectables(all);
      },
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for <code>changeSelected</code> event on single
       * selection manager.
       *
       * @param e {qx.event.type.Data} Data event.
       */
      _onChangeSelected(e) {
        var newValue = e.getData();
        var oldValue = e.getOldData();
        this.fireDataEvent("changeValue", newValue, oldValue);
        newValue == null ? newValue = [] : newValue = [newValue];
        oldValue == null ? oldValue = [] : oldValue = [oldValue];
        this.fireDataEvent("changeSelection", newValue, oldValue);
      },
      /**
       * Return the selection manager if it is already exists, otherwise creates
       * the manager.
       *
       * @return {qx.ui.core.SingleSelectionManager} Single selection manager.
       */
      __getManager__P_59_1() {
        if (this.__manager__P_59_0 == null) {
          var that = this;
          this.__manager__P_59_0 = new qx.ui.core.SingleSelectionManager({
            getItems() {
              return that._getItems();
            },
            isItemSelectable(item) {
              if (that._isItemSelectable) {
                return that._isItemSelectable(item);
              } else {
                return item.isVisible();
              }
            }
          });
          this.__manager__P_59_0.addListener("changeSelected", this._onChangeSelected, this);
        }
        this.__manager__P_59_0.setAllowEmptySelection(this._isAllowEmptySelection());
        return this.__manager__P_59_0;
      }
    },
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._disposeObjects("__manager__P_59_0");
    }
  });
  qx.ui.core.MSingleSelectionHandling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.IField": {
        "require": true
      },
      "qx.ui.core.ISingleSelection": {
        "require": true
      },
      "qx.ui.core.MSingleSelectionHandling": {
        "require": true
      },
      "qx.ui.core.MChildrenHandling": {
        "require": true
      },
      "qx.ui.layout.Grow": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
       * Adrian Olaru (adrianolaru)
  
  ************************************************************************ */

  /**
   * The stack container puts its child widgets on top of each other and only the
   * topmost widget is visible.
   *
   * This is used e.g. in the tab view widget. Which widget is visible can be
   * controlled by using the {@link #getSelection} method.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   // create stack container
   *   var stack = new qx.ui.container.Stack();
   *
   *   // add some children
   *   stack.add(new qx.ui.core.Widget().set({
   *    backgroundColor: "red"
   *   }));
   *   stack.add(new qx.ui.core.Widget().set({
   *    backgroundColor: "green"
   *   }));
   *   stack.add(new qx.ui.core.Widget().set({
   *    backgroundColor: "blue"
   *   }));
   *
   *   // select green widget
   *   stack.setSelection([stack.getChildren()[1]]);
   *
   *   this.getRoot().add(stack);
   * </pre>
   *
   * This example creates an stack with three children. Only the selected "green"
   * widget is visible.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/stack.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.container.Stack", {
    extend: qx.ui.core.Widget,
    implement: [qx.ui.form.IField, qx.ui.core.ISingleSelection],
    include: [qx.ui.core.MSingleSelectionHandling, qx.ui.core.MChildrenHandling],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.core.Widget.constructor.call(this);
      this._setLayout(new qx.ui.layout.Grow());
      this.addListener("changeSelection", this.__onChangeSelection__P_50_0, this);
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Whether the size of the widget depends on the selected child. When
       * disabled (default) the size is configured to the largest child.
       */
      dynamic: {
        check: "Boolean",
        init: false,
        apply: "_applyDynamic"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // property apply
      _applyDynamic(value) {
        var children = this._getChildren();
        var selected = this.getSelection()[0];
        var child;
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          if (child != selected) {
            if (value) {
              children[i].exclude();
            } else {
              children[i].hide();
            }
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS FOR SELECTION API
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the widget for the selection.
       * @return {qx.ui.core.Widget[]} Widgets to select.
       */
      _getItems() {
        return this.getChildren();
      },
      /**
       * Returns if the selection could be empty or not.
       *
       * @return {Boolean} <code>true</code> If selection could be empty,
       *    <code>false</code> otherwise.
       */
      _isAllowEmptySelection() {
        return true;
      },
      /**
       * Returns whether the given item is selectable.
       *
       * @param item {qx.ui.core.Widget} The item to be checked
       * @return {Boolean} Whether the given item is selectable
       */
      _isItemSelectable(item) {
        return true;
      },
      /**
       * Event handler for <code>changeSelection</code>.
       *
       * Shows the new selected widget and hide the old one.
       *
       * @param e {qx.event.type.Data} Data event.
       */
      __onChangeSelection__P_50_0(e) {
        var old = e.getOldData()[0];
        var value = e.getData()[0];
        if (old) {
          if (this.isDynamic()) {
            old.exclude();
          } else {
            old.hide();
          }
        }
        if (value) {
          value.show();
        }
      },
      //overridden
      _afterAddChild(child) {
        var selected = this.getSelection()[0];
        if (!selected) {
          this.setSelection([child]);
        } else if (selected !== child) {
          if (this.isDynamic()) {
            child.exclude();
          } else {
            child.hide();
          }
        }
      },
      //overridden
      _afterRemoveChild(child) {
        if (this.getSelection()[0] === child) {
          var first = this._getChildren()[0];
          if (first) {
            this.setSelection([first]);
          } else {
            this.resetSelection();
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Go to the previous child in the children list.
       */
      previous() {
        var selected = this.getSelection()[0];
        var go = this._indexOf(selected) - 1;
        var children = this._getChildren();
        if (go < 0) {
          go = children.length - 1;
        }
        var prev = children[go];
        this.setSelection([prev]);
      },
      /**
       * Go to the next child in the children list.
       */
      next() {
        var selected = this.getSelection()[0];
        var go = this._indexOf(selected) + 1;
        var children = this._getChildren();
        var next = children[go] || children[0];
        this.setSelection([next]);
      }
    }
  });
  qx.ui.container.Stack.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.Abstract": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * The grow layout stretches all children to the full available size
   * but still respects limits configured by min/max values.
   *
   * It will place all children over each other with the top and left coordinates
   * set to <code>0</code>. The {@link qx.ui.container.Stack} and the
   * {@link qx.ui.core.scroll.ScrollPane} are using this layout.
   *
   * *Features*
   *
   * * Auto-sizing
   * * Respects minimum and maximum child dimensions
   *
   * *Item Properties*
   *
   * None
   *
   * *Example*
   *
   * <pre class="javascript">
   * var layout = new qx.ui.layout.Grow();
   *
   * var w1 = new qx.ui.core.Widget();
   * var w2 = new qx.ui.core.Widget();
   * var w3 = new qx.ui.core.Widget();
   *
   * var container = new qx.ui.container.Composite(layout);
   * container.add(w1);
   * container.add(w2);
   * container.add(w3);
   * </pre>
   *
   * *External Documentation*
   *
   * <a href='https://qooxdoo.org/documentation/#/desktop/layout/grow.md'>
   * Extended documentation</a> and links to demos of this layout in the qooxdoo manual.
   */
  qx.Class.define("qx.ui.layout.Grow", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          this.assert(false, "The property '" + name + "' is not supported by the Grow layout!");
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        var children = this._getLayoutChildren();
        var child, size, width, height;

        // Render children
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          size = child.getSizeHint();
          width = availWidth;
          if (width < size.minWidth) {
            width = size.minWidth;
          } else if (width > size.maxWidth) {
            width = size.maxWidth;
          }
          height = availHeight;
          if (height < size.minHeight) {
            height = size.minHeight;
          } else if (height > size.maxHeight) {
            height = size.maxHeight;
          }
          child.renderLayout(padding.left, padding.top, width, height);
        }
      },
      // overridden
      _computeSizeHint() {
        var children = this._getLayoutChildren();
        var child, size;
        var neededWidth = 0,
          neededHeight = 0;
        var minWidth = 0,
          minHeight = 0;
        var maxWidth = Infinity,
          maxHeight = Infinity;

        // Iterate over children
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          size = child.getSizeHint();
          neededWidth = Math.max(neededWidth, size.width);
          neededHeight = Math.max(neededHeight, size.height);
          minWidth = Math.max(minWidth, size.minWidth);
          minHeight = Math.max(minHeight, size.minHeight);
          maxWidth = Math.min(maxWidth, size.maxWidth);
          maxHeight = Math.min(maxHeight, size.maxHeight);
        }

        // Return hint
        return {
          width: neededWidth,
          height: neededHeight,
          minWidth: minWidth,
          minHeight: minHeight,
          maxWidth: maxWidth,
          maxHeight: maxHeight
        };
      }
    }
  });
  qx.ui.layout.Grow.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-13.js.map?dt=1769807054028
qx.$$packageData['13'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
