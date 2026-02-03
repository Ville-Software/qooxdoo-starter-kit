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
   * This interface should be used in all objects managing a set of items
   * implementing {@link qx.ui.form.IModel}.
   */
  qx.Interface.define("qx.ui.form.IModelSelection", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Tries to set the selection using the given array containing the
       * representative models for the selectables.
       *
       * @param value {Array} An array of models.
       */
      setModelSelection(value) {},
      /**
       * Returns an array of the selected models.
       *
       * @return {qx.data.Array} An array containing the models of the currently selected
       *   items.
       */
      getModelSelection() {}
    }
  });
  qx.ui.form.IModelSelection.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.data.Array": {
        "construct": true
      },
      "qx.lang.Array": {}
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
   * This mixin offers the selection of the model properties.
   * It can only be included if the object including it implements the
   * {@link qx.ui.core.ISingleSelection} interface and the selectables implement
   * the {@link qx.ui.form.IModel} interface.
   */
  qx.Mixin.define("qx.ui.form.MModelSelection", {
    construct() {
      // create the selection array
      this.__modelSelection__P_60_0 = new qx.data.Array();

      // listen to the changes
      this.__modelSelection__P_60_0.addListener("change", this.__onModelSelectionArrayChange__P_60_1, this);
      this.addListener("changeSelection", this.__onModelSelectionChange__P_60_2, this);
    },
    events: {
      /**
       * Pseudo event. It will never be fired because the array itself can not
       * be changed. But the event description is needed for the data binding.
       */
      changeModelSelection: "qx.event.type.Data"
    },
    members: {
      __modelSelection__P_60_0: null,
      __inSelectionChange__P_60_3: false,
      /**
       * Handler for the selection change of the including class e.g. SelectBox,
       * List, ...
       * It sets the new modelSelection via {@link #setModelSelection}.
       */
      __onModelSelectionChange__P_60_2() {
        if (this.__inSelectionChange__P_60_3) {
          return;
        }
        var data = this.getSelection();

        // create the array with the modes inside
        var modelSelection = [];
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          // fallback if getModel is not implemented
          var model = item.getModel ? item.getModel() : null;
          if (model !== null) {
            modelSelection.push(model);
          }
        }
        try {
          this.setModelSelection(modelSelection);
        } catch (e) {
          throw new Error("Could not set the model selection. Maybe your models are not unique? " + e);
        }
      },
      /**
       * Listener for the change of the internal model selection data array.
       */
      __onModelSelectionArrayChange__P_60_1() {
        this.__inSelectionChange__P_60_3 = true;
        var selectables = this.getSelectables(true);
        var itemSelection = [];
        var modelSelection = this.__modelSelection__P_60_0.toArray();
        for (var i = 0; i < modelSelection.length; i++) {
          var model = modelSelection[i];
          for (var j = 0; j < selectables.length; j++) {
            var selectable = selectables[j];
            // fallback if getModel is not implemented
            var selectableModel = selectable.getModel ? selectable.getModel() : null;
            if (model === selectableModel) {
              itemSelection.push(selectable);
              break;
            }
          }
        }
        this.setSelection(itemSelection);
        this.__inSelectionChange__P_60_3 = false;

        // check if the setting has worked
        var currentSelection = this.getSelection();
        if (!qx.lang.Array.equals(currentSelection, itemSelection)) {
          // if not, set the actual selection
          this.__onModelSelectionChange__P_60_2();
        }
      },
      /**
       * Returns always an array of the models of the selected items. If no
       * item is selected or no model is given, the array will be empty.
       *
       * *CAREFUL!* The model selection can only work if every item item in the
       * selection providing widget has a model property!
       *
       * @return {qx.data.Array} An array of the models of the selected items.
       */
      getModelSelection() {
        return this.__modelSelection__P_60_0;
      },
      /**
       * Takes the given models in the array and searches for the corresponding
       * selectables. If an selectable does have that model attached, it will be
       * selected.
       *
       * *Attention:* This method can have a time complexity of O(n^2)!
       *
       * *CAREFUL!* The model selection can only work if every item item in the
       * selection providing widget has a model property!
       *
       * @param modelSelection {Array} An array of models, which should be
       *   selected.
       */
      setModelSelection(modelSelection) {
        // check for null values
        if (!modelSelection) {
          this.__modelSelection__P_60_0.removeAll();
          return;
        }
        {
          this.assertArray(modelSelection, "Please use an array as parameter.");
        }

        // add the first two parameter
        modelSelection.unshift(this.__modelSelection__P_60_0.getLength()); // remove index
        modelSelection.unshift(0); // start index

        var returnArray = this.__modelSelection__P_60_0.splice.apply(this.__modelSelection__P_60_0, modelSelection);
        returnArray.dispose();
      }
    },
    destruct() {
      this._disposeObjects("__modelSelection__P_60_0");
    }
  });
  qx.ui.form.MModelSelection.$$dbClassInfo = $$dbClassInfo;
})();

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
      "qx.ui.core.ISingleSelection": {
        "require": true
      },
      "qx.ui.form.IField": {
        "require": true
      },
      "qx.ui.form.IForm": {
        "require": true
      },
      "qx.ui.form.IModelSelection": {
        "require": true
      },
      "qx.ui.core.MSingleSelectionHandling": {
        "require": true
      },
      "qx.ui.form.MModelSelection": {
        "require": true
      },
      "qx.lang.String": {},
      "qx.lang.Array": {},
      "qx.ui.core.FocusHandler": {}
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
       * Christian Hagendorn (chris_schmidt)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The radio group handles a collection of items from which only one item
   * can be selected. Selection another item will deselect the previously selected
   * item.
   *
   * This class is e.g. used to create radio groups or {@link qx.ui.form.RadioButton}
   * or {@link qx.ui.toolbar.RadioButton} instances.
   *
   * We also offer a widget for the same purpose which uses this class. So if
   * you like to act with a widget instead of a pure logic coupling of the
   * widgets, take a look at the {@link qx.ui.form.RadioButtonGroup} widget.
   */
  qx.Class.define("qx.ui.form.RadioGroup", {
    extend: qx.core.Object,
    implement: [qx.ui.core.ISingleSelection, qx.ui.form.IField, qx.ui.form.IForm, qx.ui.form.IModelSelection],
    include: [qx.ui.core.MSingleSelectionHandling, qx.ui.form.MModelSelection],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param varargs {qx.core.Object} A variable number of items, which are
     *     initially added to the radio group, the first item will be selected.
     */
    construct(varargs) {
      qx.core.Object.constructor.call(this);

      // create item array
      this.__items__P_17_0 = [];

      // add listener before call add!!!
      this.addListener("changeSelection", this.__onChangeSelection__P_17_1, this);
      if (varargs != null) {
        this.add.apply(this, arguments);
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * The property name in each of the added widgets that is grouped
       */
      groupedProperty: {
        check: "String",
        apply: "_applyGroupedProperty",
        event: "changeGroupedProperty",
        init: "value"
      },
      /**
       * The property name in each of the added widgets that is informed of the
       * RadioGroup object it is a member of
       */
      groupProperty: {
        check: "String",
        event: "changeGroupProperty",
        init: "group"
      },
      /**
       * Whether the radio group is enabled
       */
      enabled: {
        check: "Boolean",
        apply: "_applyEnabled",
        event: "changeEnabled",
        init: true
      },
      /**
       * Whether the selection should wrap around. This means that the successor of
       * the last item is the first item.
       */
      wrap: {
        check: "Boolean",
        init: true
      },
      /**
       * If is set to <code>true</code> the selection could be empty,
       * otherwise is always one <code>RadioButton</code> selected.
       */
      allowEmptySelection: {
        check: "Boolean",
        init: false,
        apply: "_applyAllowEmptySelection"
      },
      /**
       * Flag signaling if the group at all is valid. All children will have the
       * same state.
       */
      valid: {
        check: "Boolean",
        init: true,
        apply: "_applyValid",
        event: "changeValid"
      },
      /**
       * Flag signaling if the group is required.
       */
      required: {
        check: "Boolean",
        init: false,
        event: "changeRequired"
      },
      /**
       * Message which is shown in an invalid tooltip.
       */
      invalidMessage: {
        check: "String",
        init: "",
        event: "changeInvalidMessage",
        apply: "_applyInvalidMessage"
      },
      /**
       * Message which is shown in an invalid tooltip if the {@link #required} is
       * set to true.
       */
      requiredInvalidMessage: {
        check: "String",
        nullable: true,
        event: "changeInvalidMessage"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** @type {qx.ui.form.IRadioItem[]} The items of the radio group */
      __items__P_17_0: null,
      /*
      ---------------------------------------------------------------------------
        UTILITIES
      ---------------------------------------------------------------------------
      */

      /**
       * Get all managed items
       *
       * @return {qx.ui.form.IRadioItem[]} All managed items.
       */
      getItems() {
        return this.__items__P_17_0;
      },
      /*
      ---------------------------------------------------------------------------
        REGISTRY
      ---------------------------------------------------------------------------
      */

      /**
       * Add the passed items to the radio group.
       *
       * @param varargs {qx.ui.form.IRadioItem} A variable number of items to add.
       */
      add(varargs) {
        var items = this.__items__P_17_0;
        var item;
        var groupedProperty = this.getGroupedProperty();
        var groupedPropertyUp = qx.lang.String.firstUp(groupedProperty);
        for (var i = 0, l = arguments.length; i < l; i++) {
          item = arguments[i];
          if (items.includes(item)) {
            continue;
          }

          // Register listeners
          item.addListener("change" + groupedPropertyUp, this._onItemChangeChecked, this);

          // Push RadioButton to array
          items.push(item);

          // Inform radio button about new group
          item.set(this.getGroupProperty(), this);

          // Need to update internal value?
          if (item.get(groupedProperty)) {
            this.setSelection([item]);
          }
        }

        // Select first item when only one is registered
        if (!this.isAllowEmptySelection() && items.length > 0 && !this.getSelection()[0]) {
          this.setSelection([items[0]]);
        }
      },
      /**
       * Remove an item from the radio group.
       *
       * @param item {qx.ui.form.IRadioItem} The item to remove.
       */
      remove(item) {
        var items = this.__items__P_17_0;
        var groupedProperty = this.getGroupedProperty();
        var groupedPropertyUp = qx.lang.String.firstUp(groupedProperty);
        if (items.includes(item)) {
          // Remove RadioButton from array
          qx.lang.Array.remove(items, item);

          // Inform radio button about new group
          if (item.get(this.getGroupProperty()) === this) {
            item.reset(this.getGroupProperty());
          }

          // Deregister listeners
          item.removeListener("change" + groupedPropertyUp, this._onItemChangeChecked, this);

          // if the radio was checked, set internal selection to null
          if (item.get(groupedProperty)) {
            this.resetSelection();
          }
        }
      },
      /**
       * Returns an array containing the group's items.
       *
       * @return {qx.ui.form.IRadioItem[]} The item array
       */
      getChildren() {
        return this.__items__P_17_0;
      },
      /*
      ---------------------------------------------------------------------------
        LISTENER FOR ITEM CHANGES
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for <code>changeValue</code> event of every managed item.
       *
       * @param e {qx.event.type.Data} Data event
       */
      _onItemChangeChecked(e) {
        var item = e.getTarget();
        var groupedProperty = this.getGroupedProperty();
        if (item.get(groupedProperty)) {
          this.setSelection([item]);
        } else if (this.getSelection()[0] == item) {
          this.resetSelection();
        }
      },
      /*
      ---------------------------------------------------------------------------
        APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyGroupedProperty(value, old) {
        var item;
        var oldFirstUp = qx.lang.String.firstUp(old);
        var newFirstUp = qx.lang.String.firstUp(value);
        for (var i = 0; i < this.__items__P_17_0.length; i++) {
          item = this.__items__P_17_0[i];

          // remove the listener for the old change event
          item.removeListener("change" + oldFirstUp, this._onItemChangeChecked, this);

          // add the listener for the new change event
          item.removeListener("change" + newFirstUp, this._onItemChangeChecked, this);
        }
      },
      // property apply
      _applyInvalidMessage(value, old) {
        for (var i = 0; i < this.__items__P_17_0.length; i++) {
          this.__items__P_17_0[i].setInvalidMessage(value);
        }
      },
      // property apply
      _applyValid(value, old) {
        for (var i = 0; i < this.__items__P_17_0.length; i++) {
          this.__items__P_17_0[i].setValid(value);
        }
      },
      // property apply
      _applyEnabled(value, old) {
        var items = this.__items__P_17_0;
        if (value == null) {
          for (var i = 0, l = items.length; i < l; i++) {
            items[i].resetEnabled();
          }
        } else {
          for (var i = 0, l = items.length; i < l; i++) {
            items[i].setEnabled(value);
          }
        }
      },
      // property apply
      _applyAllowEmptySelection(value, old) {
        if (!value && this.isSelectionEmpty()) {
          this.resetSelection();
        }
      },
      /*
      ---------------------------------------------------------------------------
        SELECTION
      ---------------------------------------------------------------------------
      */

      /**
       * Select the item following the given item.
       */
      selectNext() {
        var item = this.getSelection()[0];
        var items = this.__items__P_17_0;
        var index = items.indexOf(item);
        if (index == -1) {
          return;
        }
        var i = 0;
        var length = items.length;

        // Find next enabled item
        if (this.getWrap()) {
          index = (index + 1) % length;
        } else {
          index = Math.min(index + 1, length - 1);
        }
        while (i < length && !items[index].getEnabled()) {
          index = (index + 1) % length;
          i++;
        }
        this.setSelection([items[index]]);
      },
      /**
       * Select the item previous the given item.
       */
      selectPrevious() {
        var item = this.getSelection()[0];
        var items = this.__items__P_17_0;
        var index = items.indexOf(item);
        if (index == -1) {
          return;
        }
        var i = 0;
        var length = items.length;

        // Find previous enabled item
        if (this.getWrap()) {
          index = (index - 1 + length) % length;
        } else {
          index = Math.max(index - 1, 0);
        }
        while (i < length && !items[index].getEnabled()) {
          index = (index - 1 + length) % length;
          i++;
        }
        this.setSelection([items[index]]);
      },
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS FOR SELECTION API
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the items for the selection.
       *
       * @return {qx.ui.form.IRadioItem[]} Items to select.
       */
      _getItems() {
        return this.getItems();
      },
      /**
       * Returns if the selection could be empty or not.
       *
       * @return {Boolean} <code>true</code> If selection could be empty,
       *    <code>false</code> otherwise.
       */
      _isAllowEmptySelection() {
        return this.isAllowEmptySelection();
      },
      /**
       * Returns whether the item is selectable. In opposite to the default
       * implementation (which checks for visible items) every radio button
       * which is part of the group is selected even if it is currently not visible.
       *
       * @param item {qx.ui.form.IRadioItem} The item to check if its selectable.
       * @return {Boolean} <code>true</code> if the item is part of the radio group
       *    <code>false</code> otherwise.
       */
      _isItemSelectable(item) {
        return this.__items__P_17_0.indexOf(item) != -1;
      },
      /**
       * Event handler for <code>changeSelection</code>.
       *
       * @param e {qx.event.type.Data} Data event.
       */
      __onChangeSelection__P_17_1(e) {
        var value = e.getData()[0];
        var old = e.getOldData()[0];
        var groupedProperty = this.getGroupedProperty();
        if (old) {
          old.set(groupedProperty, false);
        }
        if (value) {
          value.set(groupedProperty, true);

          // If Group is focused, the selection was changed by keyboard. Switch focus to new value
          if (this.__isGroupFocused__P_17_2() && value.isFocusable()) {
            value.focus();
          }
        }
      },
      /**
       * Checks if this group is focused by checking focused state of each item
       * @returns {Boolean} result
       */
      __isGroupFocused__P_17_2() {
        const focusHandler = qx.ui.core.FocusHandler.getInstance();
        for (const item of this._getItems()) {
          if (focusHandler.isFocused(item)) {
            return true;
          }
        }
        return false;
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._disposeArray("__items__P_17_0");
    }
  });
  qx.ui.form.RadioGroup.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-25.js.map?dt=1769807054255
qx.$$packageData['25'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
