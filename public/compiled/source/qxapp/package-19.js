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
      "qx.ui.form.IExecutable": {
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
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A Button widget which supports various states and allows it to be used
   * via the mouse, touch, pen and the keyboard.
   *
   * If the user presses the button by clicking on it, or the <code>Enter</code> or
   * <code>Space</code> keys, the button fires an {@link qx.ui.core.MExecutable#execute} event.
   *
   * If the {@link qx.ui.core.MExecutable#command} property is set, the
   * command is executed as well.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   var button = new qx.ui.form.Button("Hello World");
   *
   *   button.addListener("execute", function(e) {
   *     alert("Button was clicked");
   *   }, this);
   *
   *   this.getRoot().add(button);
   * </pre>
   *
   * This example creates a button with the label "Hello World" and attaches an
   * event listener to the {@link #execute} event.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/button.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.form.Button", {
    extend: qx.ui.basic.Atom,
    include: [qx.ui.core.MExecutable],
    implement: [qx.ui.form.IExecutable],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String} label of the atom
     * @param icon {String?null} Icon URL of the atom
     * @param command {qx.ui.command.Command?null} Command instance to connect with
     */
    construct(label, icon, command) {
      qx.ui.basic.Atom.constructor.call(this, label, icon);
      if (command != null) {
        this.setCommand(command);
      }

      // ARIA attrs
      this.getContentElement().setAttribute("role", "button");

      // Add listeners
      this.addListener("pointerover", this._onPointerOver);
      this.addListener("pointerout", this._onPointerOut);
      this.addListener("pointerdown", this._onPointerDown);
      this.addListener("pointerup", this._onPointerUp);

      // it seems that touching a button (at least on ios and android)
      // does not immediately focus it before triggering the tap event
      // this causes problem with change events for any input field that
      // previously held focus, as their change event will arrive AFTER
      // the execute event on the button ... 
      // we have to call focus on the dom element itself, to make
      // sure we are in time. Otherwhise the virtual dom in qooxdoo will
      // delay the effect and the fix will only work when tapping 'slowly' ... 
      this.addListenerOnce('appear', () => {
        let el = this.getContentElement().getDomElement();
        this.addListener('touchstart', () => {
          el.focus();
        });
      });
      this.addListener("tap", this._onTap);
      this.addListener("keydown", this._onKeyDown);
      this.addListener("keyup", this._onKeyUp);
      // Stop events
      this.addListener("dblclick", function (e) {
        e.stopPropagation();
      });
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
        init: "button"
      },
      // overridden
      focusable: {
        refine: true,
        init: true
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        focused: true,
        hovered: true,
        pressed: true,
        disabled: true
      },
      /*
      ---------------------------------------------------------------------------
        USER API
      ---------------------------------------------------------------------------
      */

      /**
       * Manually press the button
       */
      press() {
        if (this.hasState("abandoned")) {
          return;
        }
        this.addState("pressed");
      },
      /**
       * Manually release the button
       */
      release() {
        if (this.hasState("pressed")) {
          this.removeState("pressed");
        }
      },
      /**
       * Completely reset the button (remove all states)
       */
      reset() {
        this.removeState("pressed");
        this.removeState("abandoned");
        this.removeState("hovered");
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Listener method for "pointerover" event
       * <ul>
       * <li>Adds state "hovered"</li>
       * <li>Removes "abandoned" and adds "pressed" state (if "abandoned" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Mouse event
       */
      _onPointerOver(e) {
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
        if (this.hasState("abandoned")) {
          this.removeState("abandoned");
          this.addState("pressed");
        }
        this.addState("hovered");
      },
      /**
       * Listener method for "pointerout" event
       * <ul>
       * <li>Removes "hovered" state</li>
       * <li>Adds "abandoned" and removes "pressed" state (if "pressed" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Mouse event
       */
      _onPointerOut(e) {
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
        this.removeState("hovered");
        if (this.hasState("pressed")) {
          this.removeState("pressed");
          this.addState("abandoned");
        }
      },
      /**
       * Listener method for "pointerdown" event
       * <ul>
       * <li>Removes "abandoned" state</li>
       * <li>Adds "pressed" state</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Mouse event
       */
      _onPointerDown(e) {
        if (!e.isLeftPressed()) {
          return;
        }
        e.stopPropagation();

        // Activate capturing if the button get a pointerout while
        // the button is pressed.
        this.capture();
        this.removeState("abandoned");
        this.addState("pressed");
      },
      /**
       * Listener method for "pointerup" event
       * <ul>
       * <li>Removes "pressed" state (if set)</li>
       * <li>Removes "abandoned" state (if set)</li>
       * <li>Adds "hovered" state (if "abandoned" state is not set)</li>
       *</ul>
       *
       * @param e {qx.event.type.Pointer} Mouse event
       */
      _onPointerUp(e) {
        this.releaseCapture();

        // We must remove the states before executing the command
        // because in cases were the window lost the focus while
        // executing we get the capture phase back (mouseout).
        var hasPressed = this.hasState("pressed");
        var hasAbandoned = this.hasState("abandoned");
        if (hasPressed) {
          this.removeState("pressed");
        }
        if (hasAbandoned) {
          this.removeState("abandoned");
        }
        e.stopPropagation();
      },
      /**
       * Listener method for "tap" event which stops the propagation.
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onTap(e) {
        // "execute" is fired here so that the button can be dragged
        // without executing it (e.g. in a TabBar with overflow)
        this.execute();
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
       * for the keys "Enter" or "Space"
       *
       * @param e {Event} Key event
       */
      _onKeyUp(e) {
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            if (this.hasState("pressed")) {
              this.removeState("abandoned");
              this.removeState("pressed");
              this.execute();
              e.stopPropagation();
            }
        }
      }
    }
  });
  qx.ui.form.Button.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.Button": {
        "construct": true,
        "require": true
      },
      "qx.ui.menu.Menu": {},
      "qx.ui.core.FocusHandler": {},
      "qx.ui.menu.Manager": {}
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
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * A button which opens the connected menu when tapping on it.
   */
  qx.Class.define("qx.ui.form.MenuButton", {
    extend: qx.ui.form.Button,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String} Initial label
     * @param icon {String?null} Initial icon
     * @param menu {qx.ui.menu.Menu} Connect to menu instance
     */
    construct(label, icon, menu) {
      qx.ui.form.Button.constructor.call(this, label, icon);

      // Initialize properties
      if (menu != null) {
        this.setMenu(menu);
      }

      // ARIA attrs
      this.getContentElement().setAttribute("role", "button");
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The menu instance to show when tapping on the button */
      menu: {
        check: "qx.ui.menu.Menu",
        nullable: true,
        apply: "_applyMenu",
        event: "changeMenu"
      },
      // overridden
      appearance: {
        refine: true,
        init: "menubutton"
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
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */
      // overridden
      _applyVisibility(value, old) {
        qx.ui.form.MenuButton.superclass.prototype._applyVisibility.call(this, value, old);

        // hide the menu too
        var menu = this.getMenu();
        if (value != "visible" && menu) {
          menu.hide();
        }
      },
      // property apply
      _applyMenu(value, old) {
        if (old) {
          old.removeListener("changeVisibility", this._onMenuChange, this);
          old.resetOpener();
        }
        if (value) {
          value.addListener("changeVisibility", this._onMenuChange, this);
          value.setOpener(this);
          value.removeState("submenu");
          value.removeState("contextmenu");
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
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Positions and shows the attached menu widget.
       *
       * @param selectFirst {Boolean?false} Whether the first menu button should be selected
       */
      open(selectFirst) {
        var menu = this.getMenu();
        if (menu) {
          // Focus this button when the menu opens
          if (this.isFocusable() && !qx.ui.core.FocusHandler.getInstance().isFocused(this)) {
            this.focus();
          }
          // Hide all menus first
          qx.ui.menu.Manager.getInstance().hideAll();

          // Open the attached menu
          menu.setOpener(this);
          menu.open();

          // Select first item
          if (selectFirst) {
            var first = menu.getSelectables()[0];
            if (first) {
              menu.setSelectedButton(first);
            }
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Listener for visibility property changes of the attached menu
       *
       * @param e {qx.event.type.Data} Property change event
       */
      _onMenuChange(e) {
        var menu = this.getMenu();
        const menuVisible = menu.isVisible();
        if (menuVisible) {
          this.addState("pressed");
        } else {
          this.removeState("pressed");
        }

        // ARIA attrs
        this.getContentElement().setAttribute("aria-expanded", menuVisible);
      },
      // overridden
      _onPointerDown(e) {
        // call the base function to get into the capture phase [BUG #4340]
        qx.ui.form.MenuButton.superclass.prototype._onPointerDown.call(this, e);

        // only open on left clicks [BUG #5125]
        if (e.getButton() != "left") {
          return;
        }
        var menu = this.getMenu();
        if (menu) {
          // Toggle sub menu visibility
          if (!menu.isVisible()) {
            this.open();
          } else {
            menu.exclude();
          }

          // Event is processed, stop it for others
          e.stopPropagation();
        }
      },
      // overridden
      _onPointerUp(e) {
        // call base for firing the execute event
        qx.ui.form.MenuButton.superclass.prototype._onPointerUp.call(this, e);

        // Just stop propagation to stop menu manager
        // from getting the event
        e.stopPropagation();
      },
      // overridden
      _onPointerOver(e) {
        // Add hovered state
        this.addState("hovered");
      },
      // overridden
      _onPointerOut(e) {
        // Just remove the hover state
        this.removeState("hovered");
      },
      // overridden
      _onKeyDown(e) {
        switch (e.getKeyIdentifier()) {
          case "Space":
          case "Enter":
            this.removeState("abandoned");
            this.addState("pressed");
            var menu = this.getMenu();
            if (menu) {
              // Toggle sub menu visibility
              if (!menu.isVisible()) {
                this.open();
              } else {
                menu.exclude();
              }
            }
            e.stopPropagation();
        }
      },
      // overridden
      _onKeyUp(e) {
        // no action required here
      }
    }
  });
  qx.ui.form.MenuButton.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-19.js.map?dt=1791845587551
qx.$$packageData['19'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
