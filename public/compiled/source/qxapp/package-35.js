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
       2021 Zenesis Ltd (https://www.zenesis.com)
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (github.com/johnspackman)
  
  ************************************************************************ */

  /**
   * This is a marker interface for classes which can act as a children of
   * {@link qx.ui.form.List}
   */
  qx.Interface.define("qx.ui.form.IListItem", {
    /*
    *****************************************************************************
     EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired when the value was modified */
      changeReadOnly: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        READONLY PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the element's value.
       *
       * @param value {Boolean|null} The new value of the element.
       * @return {Boolean|null}
       */
      setReadOnly(value) {
        this.assertArgumentsCount(arguments, 1, 1);
      },
      /**
       * Resets the element's value to its initial value.
       */
      resetReadOnly() {},
      /**
       * The element's user set value.
       *
       * @return {Boolean|null} The value.
       */
      getReadOnly() {}
    }
  });
  qx.ui.form.IListItem.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.ToggleButton": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.MForm": {
        "require": true
      },
      "qx.ui.form.MModelProperty": {
        "require": true
      },
      "qx.ui.form.IForm": {
        "require": true
      },
      "qx.ui.form.IModel": {
        "require": true
      },
      "qx.ui.form.IListItem": {
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
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * A check box widget with an optional label.
   */
  qx.Class.define("qx.ui.form.CheckBox", {
    extend: qx.ui.form.ToggleButton,
    include: [qx.ui.form.MForm, qx.ui.form.MModelProperty],
    implement: [qx.ui.form.IForm, qx.ui.form.IModel, qx.ui.form.IListItem],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String?null} An optional label for the check box.
     */
    construct(label) {
      {
        this.assertArgumentsCount(arguments, 0, 1);
      }
      qx.ui.form.ToggleButton.constructor.call(this, label);

      // Initialize the checkbox to a valid value (the default is null which
      // is invalid)
      this.setValue(false);

      // ARIA attrs
      const contentEl = this.getContentElement();
      contentEl.setAttribute("role", "checkbox");
      contentEl.removeAttribute("aria-pressed");
      contentEl.setAttribute("aria-checked", false);
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
        init: "checkbox"
      },
      // overridden
      allowGrowX: {
        refine: true,
        init: false
      }
    },
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        invalid: true,
        focused: true,
        undetermined: true,
        checked: true,
        hovered: true
      },
      /**
       * overridden (from MExecutable to keep the icon out of the binding)
       * @lint ignoreReferenceField(_bindableProperties)
       */
      _bindableProperties: ["enabled", "label", "toolTipText", "value", "menu"],
      // overridden
      _applyValue(value, old) {
        value ? this.addState("checked") : this.removeState("checked");
        let ariaChecked = Boolean(value);
        if (this.isTriState()) {
          if (value === null) {
            ariaChecked = "mixed";
            this.addState("undetermined");
          } else if (old === null) {
            this.removeState("undetermined");
          }
        }

        // ARIA attrs
        this.getContentElement().setAttribute("aria-checked", ariaChecked);
      }
    }
  });
  qx.ui.form.CheckBox.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-35.js.map?dt=1769807054404
qx.$$packageData['35'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
