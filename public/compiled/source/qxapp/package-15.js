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
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MExecutable": {
        "require": true
      },
      "qx.ui.form.IExecutable": {
        "require": true
      },
      "qx.ui.menu.ButtonLayout": {
        "construct": true
      },
      "qx.ui.menu.Menu": {},
      "qx.ui.basic.Image": {},
      "qx.ui.basic.Label": {},
      "qx.event.Timer": {},
      "qx.ui.menu.Manager": {},
      "qx.locale.Manager": {},
      "qx.core.ObjectRegistry": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.dynlocale": {
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
   * The abstract menu button class is used for all type of menu content
   * for example normal buttons, checkboxes or radiobuttons.
   *
   * @childControl icon {qx.ui.basic.Image} icon of the button
   * @childControl label {qx.ui.basic.Label} label of the button
   * @childControl shortcut {qx.ui.basic.Label} shows if specified the shortcut
   * @childControl arrow {qx.ui.basic.Image} shows the arrow to show an additional widget (e.g. popup or submenu)
   */
  qx.Class.define("qx.ui.menu.AbstractButton", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MExecutable],
    implement: [qx.ui.form.IExecutable],
    type: "abstract",
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.core.Widget.constructor.call(this);

      // Use hard coded layout
      this._setLayout(new qx.ui.menu.ButtonLayout());

      // Add listeners
      this.addListener("tap", this._onTap);
      this.addListener("keypress", this._onKeyPress);

      // Add command listener
      this.addListener("changeCommand", this._onChangeCommand, this);
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      blockToolTip: {
        refine: true,
        init: true
      },
      /** The label text of the button */
      label: {
        check: "String",
        apply: "_applyLabel",
        nullable: true,
        event: "changeLabel"
      },
      /** Whether a sub menu should be shown and which one */
      menu: {
        check: "qx.ui.menu.Menu",
        apply: "_applyMenu",
        nullable: true,
        dereference: true,
        event: "changeMenu"
      },
      /** The icon to use */
      icon: {
        check: "String",
        apply: "_applyIcon",
        themeable: true,
        nullable: true,
        event: "changeIcon"
      },
      /** Indicates whether the label for the command (shortcut) should be visible or not. */
      showCommandLabel: {
        check: "Boolean",
        apply: "_applyShowCommandLabel",
        themeable: true,
        init: true,
        event: "changeShowCommandLabel"
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
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "icon":
            control = new qx.ui.basic.Image();
            control.setAnonymous(true);
            this._add(control, {
              column: 0
            });
            break;
          case "label":
            control = new qx.ui.basic.Label();
            control.setAnonymous(true);
            this._add(control, {
              column: 1
            });
            break;
          case "shortcut":
            control = new qx.ui.basic.Label();
            control.setAnonymous(true);
            if (!this.getShowCommandLabel()) {
              control.exclude();
            }
            this._add(control, {
              column: 2
            });
            break;
          case "arrow":
            control = new qx.ui.basic.Image();
            control.setAnonymous(true);
            this._add(control, {
              column: 3
            });
            break;
        }
        return control || qx.ui.menu.AbstractButton.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        selected: 1
      },
      /*
      ---------------------------------------------------------------------------
        LAYOUT UTILS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the dimensions of all children
       *
       * @return {Array} Preferred width of each child
       */
      getChildrenSizes() {
        var iconWidth = 0,
          labelWidth = 0,
          shortcutWidth = 0,
          arrowWidth = 0;
        if (this._isChildControlVisible("icon")) {
          var icon = this.getChildControl("icon");
          iconWidth = icon.getMarginLeft() + icon.getSizeHint().width + icon.getMarginRight();
        }
        if (this._isChildControlVisible("label")) {
          var label = this.getChildControl("label");
          labelWidth = label.getMarginLeft() + label.getSizeHint().width + label.getMarginRight();
        }
        if (this._isChildControlVisible("shortcut")) {
          var shortcut = this.getChildControl("shortcut");
          shortcutWidth = shortcut.getMarginLeft() + shortcut.getSizeHint().width + shortcut.getMarginRight();
        }
        if (this._isChildControlVisible("arrow")) {
          var arrow = this.getChildControl("arrow");
          arrowWidth = arrow.getMarginLeft() + arrow.getSizeHint().width + arrow.getMarginRight();
        }
        return [iconWidth, labelWidth, shortcutWidth, arrowWidth];
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for tap
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onTap(e) {
        if (e.isLeftPressed()) {
          this.execute();
          qx.event.Timer.once(qx.ui.menu.Manager.getInstance().hideAll, qx.ui.menu.Manager.getInstance(), 0);
        }

        // right click
        else {
          // only prevent contextmenu event if button has no further context menu.
          if (!this.getContextMenu()) {
            qx.ui.menu.Manager.getInstance().preventContextMenuOnce();
          }
        }
      },
      /**
       * Event listener for keypress event
       *
       * @param e {qx.event.type.KeySequence} keypress event
       */
      _onKeyPress(e) {
        this.execute();
      },
      /**
       * Event listener for command changes. Updates the text of the shortcut.
       *
       * @param e {qx.event.type.Data} Property change event
       */
      _onChangeCommand(e) {
        var command = e.getData();

        // do nothing if no command is set
        if (command == null) {
          return;
        }
        {
          var oldCommand = e.getOldData();
          if (!oldCommand) {
            this.__changeLocaleCommandListenerId__P_113_0 = qx.locale.Manager.getInstance().addListener("changeLocale", this._onChangeLocale, this);
          }
          if (!command && this.__changeLocaleCommandListenerId__P_113_0) {
            qx.locale.Manager.getInstance().removeListenerById(this.__changeLocaleCommandListenerId__P_113_0);
          }
        }
        var cmdString = command != null ? command.toString() : "";
        this.getChildControl("shortcut").setValue(cmdString);
      },
      /**
       * Update command string on locale changes
       */
      _onChangeLocale: qx.core.Environment.select("qx.dynlocale", {
        true(e) {
          var command = this.getCommand();
          if (command != null) {
            this.getChildControl("shortcut").setValue(command.toString());
          }
        },
        false: null
      }),
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyIcon(value, old) {
        if (value) {
          this._showChildControl("icon").setSource(value);
        } else {
          this._excludeChildControl("icon");
        }
      },
      // property apply
      _applyLabel(value, old) {
        if (value) {
          this._showChildControl("label").setValue(value);
        } else {
          this._excludeChildControl("label");
        }
      },
      // property apply
      _applyMenu(value, old) {
        if (old) {
          old.removeListener("changeVisibility", this._onMenuChange, this);
          old.resetOpener();
          old.removeState("submenu");
        }
        if (value) {
          this._showChildControl("arrow");
          value.addListener("changeVisibility", this._onMenuChange, this);
          value.setOpener(this);
          value.addState("submenu");
        } else {
          this._excludeChildControl("arrow");
        }

        // ARIA attrs
        const contentEl = this.getContentElement();
        if (!contentEl) {
          return;
        }
        if (value) {
          contentEl.setAttribute("aria-haspopup", "menu");
          contentEl.setAttribute("aria-expanded", value.isVisible());
          contentEl.setAttribute("aria-controls", value.getContentElement().getAttribute("id"));
        } else {
          contentEl.removeAttribute("aria-haspopup");
          contentEl.removeAttribute("aria-expanded");
          contentEl.removeAttribute("aria-controls");
        }
      },
      /**
       * Listener for visibility property changes of the attached menu
       *
       * @param e {qx.event.type.Data} Property change event
       */
      _onMenuChange(e) {
        // ARIA attrs
        this.getContentElement().setAttribute("aria-expanded", this.getMenu().isVisible());
      },
      // property apply
      _applyShowCommandLabel(value, old) {
        if (value) {
          this._showChildControl("shortcut");
        } else {
          this._excludeChildControl("shortcut");
        }
      }
    },
    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */

    destruct() {
      this.removeListener("changeCommand", this._onChangeCommand, this);
      if (this.getMenu()) {
        if (!qx.core.ObjectRegistry.inShutDown) {
          this.getMenu().destroy();
        }
      }
      if (true && this.__changeLocaleCommandListenerId__P_113_0) {
        qx.locale.Manager.getInstance().removeListenerById(this.__changeLocaleCommandListenerId__P_113_0);
      }
    }
  });
  qx.ui.menu.AbstractButton.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Can be included for implementing {@link qx.ui.form.IModel}. It only contains
   * a nullable property named 'model' with a 'changeModel' event.
   */
  qx.Mixin.define("qx.ui.form.MModelProperty", {
    properties: {
      /**
       * Model property for storing additional information for the including
       * object. It can act as value property on form items for example.
       *
       * Be careful using that property as this is used for the
       * {@link qx.ui.form.MModelSelection} it has some restrictions:
       *
       * * Don't use equal models in one widget using the
       *     {@link qx.ui.form.MModelSelection}.
       *
       * * Avoid setting only some model properties if the widgets are added to
       *     a {@link qx.ui.form.MModelSelection} widget.
       *
       * Both restrictions result of the fact, that the set models are deputies
       * for their widget.
       */
      model: {
        nullable: true,
        event: "changeModel",
        apply: "_applyModel",
        dereference: true
      }
    },
    members: {
      // apply method
      _applyModel(value, old) {
        // Empty implementation
      }
    }
  });
  qx.ui.form.MModelProperty.$$dbClassInfo = $$dbClassInfo;
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Each object which wants to store data representative for the real item
   * should implement this interface.
   */
  qx.Interface.define("qx.ui.form.IModel", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired when the model data changes */
      changeModel: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Set the representative data for the item.
       *
       * @param value {var} The data.
       */
      setModel(value) {},
      /**
       * Returns the representative data for the item
       *
       * @return {var} The data.
       */
      getModel() {},
      /**
       * Sets the representative data to null.
       */
      resetModel() {}
    }
  });
  qx.ui.form.IModel.$$dbClassInfo = $$dbClassInfo;
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
      "qx.lang.Array": {},
      "qx.ui.layout.Util": {},
      "qx.ui.menu.Menu": {}
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
   * Layout used for the menu buttons which may contain four elements. A icon,
   * a label, a shortcut text and an arrow (for a sub menu)
   *
   * @internal
   */
  qx.Class.define("qx.ui.menu.ButtonLayout", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          this.assert(name == "column", "The property '" + name + "' is not supported by the MenuButton layout!");
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        var children = this._getLayoutChildren();
        var child;
        var column;
        var columnChildren = [];
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          column = child.getLayoutProperties().column;
          columnChildren[column] = child;
        }
        var menu = this.__getMenu__P_183_0(children[0]);
        var columns = menu.getColumnSizes();
        var spacing = menu.getSpacingX();

        // stretch label column
        var neededWidth = qx.lang.Array.sum(columns) + spacing * (columns.length - 1);
        if (neededWidth < availWidth) {
          columns[1] += availWidth - neededWidth;
        }
        var left = padding.left,
          top = padding.top;
        var Util = qx.ui.layout.Util;
        for (var i = 0, l = columns.length; i < l; i++) {
          child = columnChildren[i];
          if (child) {
            var hint = child.getSizeHint();
            var childTop = top + Util.computeVerticalAlignOffset(child.getAlignY() || "middle", hint.height, availHeight, 0, 0);
            var offsetLeft = Util.computeHorizontalAlignOffset(child.getAlignX() || "left", hint.width, columns[i], child.getMarginLeft(), child.getMarginRight());
            child.renderLayout(left + offsetLeft, childTop, hint.width, hint.height);
          }
          if (columns[i] > 0) {
            left += columns[i] + spacing;
          }
        }
      },
      /**
       * Get the widget's menu
       *
       * @param widget {qx.ui.core.Widget} the widget to get the menu for
       * @return {qx.ui.menu.Menu} the menu
       */
      __getMenu__P_183_0(widget) {
        while (!(widget instanceof qx.ui.menu.Menu)) {
          widget = widget.getLayoutParent();
        }
        return widget;
      },
      // overridden
      _computeSizeHint() {
        var children = this._getLayoutChildren();
        var neededHeight = 0;
        var neededWidth = 0;
        for (var i = 0, l = children.length; i < l; i++) {
          var hint = children[i].getSizeHint();
          neededWidth += hint.width;
          neededHeight = Math.max(neededHeight, hint.height);
        }
        return {
          width: neededWidth,
          height: neededHeight
        };
      }
    }
  });
  qx.ui.menu.ButtonLayout.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.menu.AbstractButton": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.MModelProperty": {
        "require": true
      },
      "qx.ui.form.IRadioItem": {
        "require": true
      },
      "qx.ui.form.IBooleanForm": {
        "require": true
      },
      "qx.ui.form.IModel": {
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
   * Renders a special radio button inside a menu. The button behaves like
   * a normal {@link qx.ui.form.RadioButton} and shows a radio icon when
   * checked; normally shows no icon when not checked (depends on the theme).
   */
  qx.Class.define("qx.ui.menu.RadioButton", {
    extend: qx.ui.menu.AbstractButton,
    include: [qx.ui.form.MModelProperty],
    implement: [qx.ui.form.IRadioItem, qx.ui.form.IBooleanForm, qx.ui.form.IModel],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String} Initial label
     * @param menu {qx.ui.menu.Menu} Initial sub menu
     */
    construct(label, menu) {
      qx.ui.menu.AbstractButton.constructor.call(this);

      // ARIA attrs
      // Important: (Grouped) radio btns should be children of a div with role 'radiogroup'
      const contentEl = this.getContentElement();
      contentEl.setAttribute("role", "radio");
      contentEl.setAttribute("aria-checked", false);

      // Initialize with incoming arguments
      if (label != null) {
        this.setLabel(label);
      }
      if (menu != null) {
        this.setMenu(menu);
      }
      this.addListener("execute", this._onExecute, this);
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
        init: "menu-radiobutton"
      },
      /** The value of the widget. True, if the widget is checked. */
      value: {
        check: "Boolean",
        nullable: true,
        event: "changeValue",
        apply: "_applyValue",
        init: false
      },
      /** The assigned qx.ui.form.RadioGroup which handles the switching between registered buttons */
      group: {
        check: "qx.ui.form.RadioGroup",
        nullable: true,
        apply: "_applyGroup"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */

    members: {
      // overridden (from MExecutable to keep the icon out of the binding)
      /**
       * @lint ignoreReferenceField(_bindableProperties)
       */
      _bindableProperties: ["enabled", "label", "toolTipText", "value", "menu"],
      // property apply
      _applyValue(value, old) {
        value ? this.addState("checked") : this.removeState("checked");

        // ARIA attrs
        this.getContentElement().setAttribute("aria-checked", Boolean(value));
      },
      // property apply
      _applyGroup(value, old) {
        if (old) {
          old.remove(this);
        }
        if (value) {
          value.add(this);
        }
      },
      /**
       * Handler for the execute event.
       *
       * @param e {qx.event.type.Event} The execute event.
       */
      _onExecute(e) {
        var grp = this.getGroup();
        if (grp && grp.getAllowEmptySelection()) {
          this.toggleValue();
        } else {
          this.setValue(true);
        }
      }
    }
  });
  qx.ui.menu.RadioButton.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-15.js.map?dt=1791845587548
qx.$$packageData['15'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
