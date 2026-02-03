(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.IField": {
        "require": true
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Form interface for all form widgets which have boolean as their primary
   * data type like a checkbox.
   */
  qx.Interface.define("qx.ui.form.IBooleanForm", {
    extend: qx.ui.form.IField,
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired when the value was modified */
      changeValue: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        VALUE PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the element's value.
       *
       * @param value {Boolean|null} The new value of the element.
       * @return {Boolean|null}
       */
      setValue(value) {
        return arguments.length == 1;
      },
      /**
       * Resets the element's value to its initial value.
       */
      resetValue() {},
      /**
       * The element's user set value.
       *
       * @return {Boolean|null} The value.
       */
      getValue() {}
    }
  });
  qx.ui.form.IBooleanForm.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.RadioGroup": {}
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
  
  ************************************************************************ */

  /**
   * Each object, which should be managed by a {@link RadioGroup} have to
   * implement this interface.
   */
  qx.Interface.define("qx.ui.form.IRadioItem", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired when the item was checked or unchecked */
      changeValue: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Set whether the item is checked
       *
       * @param value {Boolean} whether the item should be checked
       */
      setValue(value) {},
      /**
       * Get whether the item is checked
       *
       * @return {Boolean} whether the item it checked
       */
      getValue() {},
      /**
       * Set the radiogroup, which manages this item
       *
       * @param value {qx.ui.form.RadioGroup} The radiogroup, which should
       *     manage the item.
       */
      setGroup(value) {
        this.assertInstance(value, qx.ui.form.RadioGroup);
      },
      /**
       * Get the radiogroup, which manages this item
       *
       * @return {qx.ui.form.RadioGroup} The radiogroup, which manages the item.
       */
      getGroup() {}
    }
  });
  qx.ui.form.IRadioItem.$$dbClassInfo = $$dbClassInfo;
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
      },
      "qx.ui.layout.Util": {},
      "qx.ui.basic.Label": {}
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
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A atom layout. Used to place an image and label in relation
   * to each other. Useful to create buttons, list items, etc.
   *
   * *Features*
   *
   * * Gap between icon and text (using {@link #gap})
   * * Vertical and horizontal mode (using {@link #iconPosition})
   * * Sorting options to place first child on top/left or bottom/right (using {@link #iconPosition})
   * * Automatically middles/centers content to the available space
   * * Auto-sizing
   * * Supports more than two children (will be processed the same way like the previous ones)
   *
   * *Item Properties*
   *
   * None
   *
   * *Notes*
   *
   * * Does not support margins and alignment of {@link qx.ui.core.LayoutItem}.
   *
   * *Alternative Names*
   *
   * None
   */
  qx.Class.define("qx.ui.layout.Atom", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The gap between the icon and the text */
      gap: {
        check: "Integer",
        init: 4,
        apply: "_applyLayoutChange"
      },
      /** The position of the icon in relation to the text */
      iconPosition: {
        check: ["left", "top", "right", "bottom", "top-left", "bottom-left", "top-right", "bottom-right"],
        init: "left",
        apply: "_applyLayoutChange"
      },
      /**
       * Whether the content should be rendered centrally when to much space
       * is available. Enabling this property centers in both axis. The behavior
       * when disabled of the centering depends on the {@link #iconPosition} property.
       * If the icon position is <code>left</code> or <code>right</code>, the X axis
       * is not centered, only the Y axis. If the icon position is <code>top</code>
       * or <code>bottom</code>, the Y axis is not centered. In case of e.g. an
       * icon position of <code>top-left</code> no axis is centered.
       */
      center: {
        check: "Boolean",
        init: false,
        apply: "_applyLayoutChange"
      }
    },
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
          this.assert(false, "The property '" + name + "' is not supported by the Atom layout!");
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        var left = padding.left;
        var top = padding.top;
        var Util = qx.ui.layout.Util;
        var iconPosition = this.getIconPosition();
        var children = this._getLayoutChildren();
        var length = children.length;
        var width, height;
        var child, hint;
        var gap = this.getGap();
        var center = this.getCenter();

        // reverse ordering
        var allowedPositions = ["bottom", "right", "top-right", "bottom-right"];
        if (allowedPositions.indexOf(iconPosition) != -1) {
          var start = length - 1;
          var end = -1;
          var increment = -1;
        } else {
          var start = 0;
          var end = length;
          var increment = 1;
        }

        // vertical
        if (iconPosition == "top" || iconPosition == "bottom") {
          if (center) {
            var allocatedHeight = 0;
            for (var i = start; i != end; i += increment) {
              height = children[i].getSizeHint().height;
              if (height > 0) {
                allocatedHeight += height;
                if (i != start) {
                  allocatedHeight += gap;
                }
              }
            }
            top += Math.round((availHeight - allocatedHeight) / 2);
          }
          var childTop = top;
          for (var i = start; i != end; i += increment) {
            child = children[i];
            hint = child.getSizeHint();
            width = Math.min(hint.maxWidth, Math.max(availWidth, hint.minWidth));
            height = hint.height;
            left = Util.computeHorizontalAlignOffset("center", width, availWidth) + padding.left;
            child.renderLayout(left, childTop, width, height);

            // Ignore pseudo invisible elements
            if (height > 0) {
              childTop = top + height + gap;
            }
          }
        }

        // horizontal
        // in this way it also supports shrinking of the first label
        else {
          var remainingWidth = availWidth;
          var shrinkTarget = null;
          var count = 0;
          for (var i = start; i != end; i += increment) {
            child = children[i];
            width = child.getSizeHint().width;
            if (width > 0) {
              if (!shrinkTarget && child instanceof qx.ui.basic.Label) {
                shrinkTarget = child;
              } else {
                remainingWidth -= width;
              }
              count++;
            }
          }
          if (count > 1) {
            var gapSum = (count - 1) * gap;
            remainingWidth -= gapSum;
          }
          if (shrinkTarget) {
            var hint = shrinkTarget.getSizeHint();
            var shrinkTargetWidth = Math.max(hint.minWidth, Math.min(remainingWidth, hint.maxWidth));
            remainingWidth -= shrinkTargetWidth;
          }
          if (center && remainingWidth > 0) {
            left += Math.round(remainingWidth / 2);
          }
          for (var i = start; i != end; i += increment) {
            child = children[i];
            hint = child.getSizeHint();
            height = Math.min(hint.maxHeight, Math.max(availHeight, hint.minHeight));
            if (child === shrinkTarget) {
              width = shrinkTargetWidth;
            } else {
              width = hint.width;
            }
            var align = "middle";
            if (iconPosition == "top-left" || iconPosition == "top-right") {
              align = "top";
            } else if (iconPosition == "bottom-left" || iconPosition == "bottom-right") {
              align = "bottom";
            }
            var childTop = top + Util.computeVerticalAlignOffset(align, hint.height, availHeight);
            child.renderLayout(left, childTop, width, height);

            // Ignore pseudo invisible childs for gap e.g.
            // empty text or unavailable images
            if (width > 0) {
              left += width + gap;
            }
          }
        }
      },
      // overridden
      _computeSizeHint() {
        var children = this._getLayoutChildren();
        var length = children.length;
        var hint, result;

        // Fast path for only one child
        if (length === 1) {
          var hint = children[0].getSizeHint();

          // Work on a copy, but do not respect max
          // values as a Atom can be rendered bigger
          // than its content.
          result = {
            width: hint.width,
            height: hint.height,
            minWidth: hint.minWidth,
            minHeight: hint.minHeight
          };
        } else {
          var minWidth = 0,
            width = 0;
          var minHeight = 0,
            height = 0;
          var iconPosition = this.getIconPosition();
          var gap = this.getGap();
          if (iconPosition === "top" || iconPosition === "bottom") {
            var count = 0;
            for (var i = 0; i < length; i++) {
              hint = children[i].getSizeHint();

              // Max of widths
              width = Math.max(width, hint.width);
              minWidth = Math.max(minWidth, hint.minWidth);

              // Sum of heights
              if (hint.height > 0) {
                height += hint.height;
                minHeight += hint.minHeight;
                count++;
              }
            }
            if (count > 1) {
              var gapSum = (count - 1) * gap;
              height += gapSum;
              minHeight += gapSum;
            }
          } else {
            var count = 0;
            for (var i = 0; i < length; i++) {
              hint = children[i].getSizeHint();

              // Max of heights
              height = Math.max(height, hint.height);
              minHeight = Math.max(minHeight, hint.minHeight);

              // Sum of widths
              if (hint.width > 0) {
                width += hint.width;
                minWidth += hint.minWidth;
                count++;
              }
            }
            if (count > 1) {
              var gapSum = (count - 1) * gap;
              width += gapSum;
              minWidth += gapSum;
            }
          }

          // Build hint
          result = {
            minWidth: minWidth,
            width: width,
            minHeight: minHeight,
            height: height
          };
        }
        return result;
      }
    }
  });
  qx.ui.layout.Atom.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.basic.Atom": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MExecutable": {
        "require": true
      },
      "qx.ui.form.IBooleanForm": {
        "require": true
      },
      "qx.ui.form.IExecutable": {
        "require": true
      },
      "qx.ui.form.IRadioItem": {
        "require": true
      },
      "qx.ui.form.RadioGroup": {}
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * A toggle Button widget
   *
   * If the user presses the button by tapping on it pressing the enter or
   * space key, the button toggles between the pressed an not pressed states.
   */
  qx.Class.define("qx.ui.form.ToggleButton", {
    extend: qx.ui.basic.Atom,
    include: [qx.ui.core.MExecutable],
    implement: [qx.ui.form.IBooleanForm, qx.ui.form.IExecutable, qx.ui.form.IRadioItem],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Creates a ToggleButton.
     *
     * @param label {String} The text on the button.
     * @param icon {String} An URI to the icon of the button.
     */
    construct(label, icon) {
      qx.ui.basic.Atom.constructor.call(this, label, icon);

      // register pointer events
      this.addListener("pointerover", this._onPointerOver);
      this.addListener("pointerout", this._onPointerOut);
      this.addListener("pointerdown", this._onPointerDown);
      this.addListener("pointerup", this._onPointerUp);

      // register keyboard events
      this.addListener("keydown", this._onKeyDown);
      this.addListener("keyup", this._onKeyUp);

      // register execute event
      this.addListener("execute", this._onExecute, this);

      // ARIA attrs
      const contentEl = this.getContentElement();
      contentEl.setAttribute("role", "button");
      contentEl.setAttribute("aria-pressed", false);
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "toggle-button"
      },
      // overridden
      focusable: {
        refine: true,
        init: true
      },
      /** The value of the widget. True, if the widget is checked. */
      value: {
        check: "Boolean",
        nullable: true,
        event: "changeValue",
        apply: "_applyValue",
        init: false
      },
      /** The assigned qx.ui.form.RadioGroup which handles the switching between registered buttons. */
      group: {
        check: "qx.ui.form.RadioGroup",
        nullable: true,
        apply: "_applyGroup"
      },
      /**
       * Whether the button has a third state. Use this for tri-state checkboxes.
       *
       * When enabled, the value null of the property value stands for "undetermined",
       * while true is mapped to "enabled" and false to "disabled" as usual. Note
       * that the value property is set to false initially.
       *
       */
      triState: {
        check: "Boolean",
        apply: "_applyTriState",
        nullable: true,
        init: null
      },
      /**
       * The behavior when the button is executed (e.g. clicked). Only useful for tri-state checkboxes.
       * If "cycle" is set, the button cycles through the states "disabled", "undetermined", and "enabled"
       * If "toggle" is set, the button toggles between "disabled" and "enabled".
       */
      executeBehavior: {
        check: ["cycle", "toggle"],
        init: "toggle"
      },
      /**
       * Whether the field is read only
       */
      readOnly: {
        check: "Boolean",
        event: "changeReadOnly",
        init: false
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** The assigned {@link qx.ui.form.RadioGroup} which handles the switching between registered buttons */
      _applyGroup(value, old) {
        if (old) {
          old.remove(this);
        }
        if (value) {
          value.add(this);
        }
      },
      /**
       * Changes the state of the button dependent on the checked value.
       *
       * @param value {Boolean} Current value
       * @param old {Boolean} Previous value
       */
      _applyValue(value, old) {
        value ? this.addState("checked") : this.removeState("checked");
        let ariaPressed = Boolean(value);
        if (this.isTriState()) {
          if (value === null) {
            ariaPressed = "mixed";
            this.addState("undetermined");
          } else if (old === null) {
            this.removeState("undetermined");
          }
        }
        this.getContentElement().setAttribute("aria-pressed", ariaPressed);
      },
      /**
       * Apply value property when triState property is modified.
       *
       * @param value {Boolean} Current value
       * @param old {Boolean} Previous value
       */
      _applyTriState(value, old) {
        this._applyValue(this.getValue());
      },
      /**
       * Handler for the execute event.
       *
       * @param e {qx.event.type.Event} The execute event.
       */
      _onExecute(e) {
        if (this.getReadOnly()) {
          return;
        }
        if (this.isTriState() && this.getExecuteBehavior() === "cycle") {
          let newValue;
          let currentValue = this.getValue();
          if (currentValue === null) {
            newValue = true;
          } else if (currentValue === true) {
            newValue = false;
          } else {
            newValue = null;
          }
          this.setValue(newValue);
        } else {
          this.toggleValue();
        }
      },
      /**
       * Listener method for "pointerover" event.
       * <ul>
       * <li>Adds state "hovered"</li>
       * <li>Removes "abandoned" and adds "pressed" state (if "abandoned" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOver(e) {
        if (e.getTarget() !== this) {
          return;
        }
        if (this.getReadOnly()) {
          return;
        }
        this.addState("hovered");
        if (this.hasState("abandoned")) {
          this.removeState("abandoned");
          this.addState("pressed");
        }
      },
      /**
       * Listener method for "pointerout" event.
       * <ul>
       * <li>Removes "hovered" state</li>
       * <li>Adds "abandoned" state (if "pressed" state is set)</li>
       * <li>Removes "pressed" state (if "pressed" state is set and button is not checked)
       * </ul>
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onPointerOut(e) {
        if (e.getTarget() !== this) {
          return;
        }
        this.removeState("hovered");
        if (this.hasState("pressed")) {
          if (!this.getValue()) {
            this.removeState("pressed");
          }
          this.addState("abandoned");
        }
      },
      /**
       * Listener method for "pointerdown" event.
       * <ul>
       * <li>Activates capturing</li>
       * <li>Removes "abandoned" state</li>
       * <li>Adds "pressed" state</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onPointerDown(e) {
        if (!e.isLeftPressed()) {
          return;
        }
        if (this.getReadOnly()) {
          return;
        }

        // Activate capturing if the button get a pointerout while
        // the button is pressed.
        this.capture();
        this.removeState("abandoned");
        this.addState("pressed");
        e.stopPropagation();
      },
      /**
       * Listener method for "pointerup" event.
       * <ul>
       * <li>Releases capturing</li>
       * <li>Removes "pressed" state (if not "abandoned" state is set and "pressed" state is set)</li>
       * <li>Removes "abandoned" state (if set)</li>
       * <li>Toggles {@link #value} (if state "abandoned" is not set and state "pressed" is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onPointerUp(e) {
        this.releaseCapture();
        if (this.hasState("abandoned")) {
          this.removeState("abandoned");
        } else if (this.hasState("pressed")) {
          this.execute();
        }
        this.removeState("pressed");
        e.stopPropagation();
      },
      /**
       * Listener method for "keydown" event.<br/>
       * Removes "abandoned" and adds "pressed" state
       * for the keys "Enter" or "Space"
       *
       * @param e {Event} Key event
       */
      _onKeyDown(e) {
        if (this.getReadOnly()) {
          return;
        }
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            this.removeState("abandoned");
            this.addState("pressed");
            e.stopPropagation();
        }
      },
      /**
       * Listener method for "keyup" event.<br/>
       * Removes "abandoned" and "pressed" state (if "pressed" state is set)
       * for the keys "Enter" or "Space". It also toggles the {@link #value} property.
       *
       * @param e {Event} Key event
       */
      _onKeyUp(e) {
        if (!this.hasState("pressed")) {
          return;
        }
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            this.removeState("abandoned");
            this.execute();
            this.removeState("pressed");
            e.stopPropagation();
        }
      }
    }
  });
  qx.ui.form.ToggleButton.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-17.js.map?dt=1769807054228
qx.$$packageData['17'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
